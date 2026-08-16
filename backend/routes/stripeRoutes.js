import express from "express";
import Stripe from "stripe";
import { sql } from "../config/db.js";

const router = express.Router();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;


async function saveCompletedOrder(session) {
  const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
  });

  const customerEmail = session.customer_details?.email || session.customer_email || null;
  const totalCents    = session.amount_total || 0;

  // Try to link the order to an existing user by email
  let userId = null;
  if (customerEmail) {
    const userRows = await sql`SELECT id FROM users WHERE email = ${customerEmail} LIMIT 1`;
    if (userRows.length > 0) userId = userRows[0].id;
  }

  // Upsert the order (idempotent — webhook may fire more than once)
  const [order] = await sql`
    INSERT INTO orders (
      user_id,
      status,
      currency,
      total_cents,
      customer_email,
      stripe_session_id,
      stripe_payment_intent_id
    )
    VALUES (
      ${userId},
      ${session.payment_status || "paid"},
      ${session.currency || "usd"},
      ${totalCents},
      ${customerEmail},
      ${session.id},
      ${session.payment_intent || null}
    )
    ON CONFLICT (stripe_session_id) DO UPDATE SET
      status                   = EXCLUDED.status,
      stripe_payment_intent_id = EXCLUDED.stripe_payment_intent_id,
      customer_email           = EXCLUDED.customer_email,
      updated_at               = CURRENT_TIMESTAMP
    RETURNING id
  `;

  // Insert order_items (only on first insert — skip if order already had items)
  const existingItems = await sql`SELECT id FROM order_items WHERE order_id = ${order.id} LIMIT 1`;
  if (existingItems.length === 0) {
    for (const item of lineItemsResponse.data) {
      const qty          = item.quantity || 1;
      const lineTotalCents = item.amount_total || 0;
      const unitCents    = Math.round(lineTotalCents / qty);

      await sql`
        INSERT INTO order_items (
          order_id,
          product_name_snapshot,
          unit_price_cents,
          quantity,
          line_total_cents
        )
        VALUES (
          ${order.id},
          ${item.description || "Unknown item"},
          ${unitCents},
          ${qty},
          ${lineTotalCents}
        )
      `;
    }

    // Record the payment
    await sql`
      INSERT INTO payments (
        order_id,
        provider,
        provider_payment_id,
        amount_cents,
        status,
        paid_at,
        raw_payload
      )
      VALUES (
        ${order.id},
        'stripe',
        ${session.payment_intent || null},
        ${totalCents},
        'paid',
        CURRENT_TIMESTAMP,
        ${JSON.stringify(session)}::jsonb
      )
    `;
  }
}


router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ success: false, message: "Missing Stripe secret key" });
    }

     const origin = req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
     console.log(origin);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
      })),
   
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create checkout session",
    });
  }
});


// STRIPE WEBHOOK
// The server captures raw body for /api/stripe/webhook and attaches it to req.rawBody
router.post("/webhook", async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ success: false, message: "Missing Stripe secret key" });
  }

  if (!webhookSecret) {
    return res.status(500).json({ success: false, message: "Missing Stripe webhook secret" });
  }

  const signature = req.headers["stripe-signature"];
  if (!signature) {
    return res.status(400).json({ success: false, message: "Missing Stripe signature" });
  }

  const rawBody = req.rawBody || req.body;

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error.message);
    return res.status(400).json({ success: false, message: `Webhook Error: ${error.message}` });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await saveCompletedOrder(event.data.object);
        break;
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return res.status(500).json({ success: false, message: "Webhook handler failed" });
  }
});

export default router;

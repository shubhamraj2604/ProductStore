import express from "express";
import Stripe from "stripe";
import { sql } from "../config/db.js";

const router = express.Router();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const formatLineItems = (lineItems = []) =>
  lineItems.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    amount_total: item.amount_total,
    currency: item.currency,
  }));

async function saveCompletedOrder(session) {
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
  });

  const items = formatLineItems(lineItems.data);

  await sql`
    INSERT INTO orders (
      stripe_session_id,
      payment_intent_id,
      payment_status,
      amount_total,
      currency,
      customer_email,
      items
    )
    VALUES (
      ${session.id},
      ${session.payment_intent || null},
      ${session.payment_status || "paid"},
      ${session.amount_total || 0},
      ${session.currency || "usd"},
      ${session.customer_details?.email || session.customer_email || null},
      ${JSON.stringify(items)}::jsonb
    )
    ON CONFLICT (stripe_session_id) DO UPDATE SET
      payment_intent_id = EXCLUDED.payment_intent_id,
      payment_status = EXCLUDED.payment_status,
      amount_total = EXCLUDED.amount_total,
      currency = EXCLUDED.currency,
      customer_email = EXCLUDED.customer_email,
      items = EXCLUDED.items,
      updated_at = CURRENT_TIMESTAMP
  `;
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

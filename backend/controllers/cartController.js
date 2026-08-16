import { sql } from "../config/db.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Upsert a user row by clerkUserId and return the internal users.id.
 * Safe to call on every request — no duplicate users are created.
 */
async function upsertUser(clerkUserId, email) {
  const [user] = await sql`
    INSERT INTO users (clerk_user_id, email)
    VALUES (${clerkUserId}, ${email || null})
    ON CONFLICT (clerk_user_id) DO UPDATE
      SET email = COALESCE(EXCLUDED.email, users.email)
    RETURNING id
  `;
  return user.id;
}

// ── Controllers ───────────────────────────────────────────────────────────────

export const getCart = async (req, res) => {
  const { clerkUserId } = req.params;

  if (!clerkUserId) {
    return res.status(400).json({ success: false, message: "Missing Clerk user id" });
  }

  try {
    // Look up the internal user id
    const userRows = await sql`SELECT id FROM users WHERE clerk_user_id = ${clerkUserId}`;

    // No user yet → empty cart
    if (userRows.length === 0) {
      return res.status(200).json({
        success: true,
        data: { clerk_user_id: clerkUserId, email: null, items: [] },
      });
    }

    const userId = userRows[0].id;

    const items = await sql`
      SELECT
        p.id          AS id,
        p.name,
        p.price_cents,
        ci.quantity,
        pi.image_url  AS image
      FROM carts c
      JOIN cart_items      ci ON ci.cart_id    = c.id
      JOIN products        p  ON p.id          = ci.product_id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = TRUE
      WHERE c.user_id = ${userId}
    `;

    const formatted = items.map((item) => ({
      id:       item.id,
      name:     item.name,
      price:    (item.price_cents / 100).toFixed(2),
      image:    item.image ?? null,
      quantity: item.quantity,
    }));

    return res.status(200).json({
      success: true,
      data: { clerk_user_id: clerkUserId, items: formatted },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

export const saveCart = async (req, res) => {
  const { clerkUserId, email, items } = req.body;

  if (!clerkUserId) {
    return res.status(400).json({ success: false, message: "Missing Clerk user id" });
  }
  if (!Array.isArray(items)) {
    return res.status(400).json({ success: false, message: "Cart items must be an array" });
  }

  try {
    // 1. Upsert user
    const userId = await upsertUser(clerkUserId, email);

    // 2. Upsert cart
    const [cart] = await sql`
      INSERT INTO carts (user_id, updated_at)
      VALUES (${userId}, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `;

    // 3. Replace cart items (clear + re-insert keeps things simple & consistent)
    await sql`DELETE FROM cart_items WHERE cart_id = ${cart.id}`;

    for (const item of items) {
      if (!item.id || !item.quantity || item.quantity <= 0) continue;
      await sql`
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES (${cart.id}, ${item.id}, ${item.quantity})
        ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity
      `;
    }

    return res.status(200).json({ success: true, data: { clerk_user_id: clerkUserId, items } });
  } catch (error) {
    console.error("Error saving cart:", error);
    return res.status(500).json({ success: false, message: "Error saving cart" });
  }
};

export const clearCart = async (req, res) => {
  const { clerkUserId } = req.params;

  if (!clerkUserId) {
    return res.status(400).json({ success: false, message: "Missing Clerk user id" });
  }

  try {
    // Find user
    const userRows = await sql`SELECT id FROM users WHERE clerk_user_id = ${clerkUserId}`;
    if (userRows.length === 0) {
      // No user → nothing to clear
      return res.status(200).json({ success: true, message: "Cart cleared" });
    }

    // Delete cart — ON DELETE CASCADE removes cart_items automatically
    await sql`DELETE FROM carts WHERE user_id = ${userRows[0].id}`;

    return res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({ success: false, message: "Error clearing cart" });
  }
};
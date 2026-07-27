import { sql } from "../config/db.js";

export const getCart = async (req, res) => {
  const { clerkUserId } = req.params;

  if (!clerkUserId) {
    return res.status(400).json({ success: false, message: "Missing Clerk user id" });
  }

  try {
    const cart = await sql`
      SELECT clerk_user_id, email, items, updated_at
      FROM carts
      WHERE clerk_user_id = ${clerkUserId}
      LIMIT 1
    `;

    return res.status(200).json({
      success: true,
      data: cart[0] || { clerk_user_id: clerkUserId, email: null, items: [] },
    });
  } catch (error) {
    console.error("Error fetching cart", error);
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
    const cart = await sql`
      INSERT INTO carts (clerk_user_id, email, items, updated_at)
      VALUES (${clerkUserId}, ${email || null}, ${JSON.stringify(items)}::jsonb, CURRENT_TIMESTAMP)
      ON CONFLICT (clerk_user_id)
      DO UPDATE SET
        email = EXCLUDED.email,
        items = EXCLUDED.items,
        updated_at = CURRENT_TIMESTAMP
      RETURNING clerk_user_id, email, items, updated_at
    `;

    return res.status(200).json({ success: true, data: cart[0] });
  } catch (error) {
    console.error("Error saving cart", error);
    return res.status(500).json({ success: false, message: "Error saving cart" });
  }
};

export const clearCart = async (req, res) => {
  const { clerkUserId } = req.params;

  if (!clerkUserId) {
    return res.status(400).json({ success: false, message: "Missing Clerk user id" });
  }

  try {
    await sql`
      DELETE FROM carts
      WHERE clerk_user_id = ${clerkUserId}
    `;

    return res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart", error);
    return res.status(500).json({ success: false, message: "Error clearing cart" });
  }
};
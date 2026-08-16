import { sql } from '../config/db.js';

export const newloginusers = async (req, res) => {
  const { clerkUserId, username, email } = req.body;

  if (!clerkUserId) {
    return res.status(400).json({ message: "clerkUserId is required" });
  }

  try {
    // Upsert user — clerk_user_id is the primary identifier
    await sql`
      INSERT INTO users (clerk_user_id, username, email)
      VALUES (${clerkUserId}, ${username || null}, ${email || null})
      ON CONFLICT (clerk_user_id) DO UPDATE
        SET username = COALESCE(EXCLUDED.username, users.username),
            email    = COALESCE(EXCLUDED.email,    users.email)
    `;
    res.status(201).json({ message: "User synced successfully" });
  } catch (error) {
    console.error("Error in newloginusers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
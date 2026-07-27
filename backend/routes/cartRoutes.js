import express from "express";
import { clearCart, getCart, saveCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/:clerkUserId", getCart);
router.put("/", saveCart);
router.delete("/:clerkUserId", clearCart);

export default router;
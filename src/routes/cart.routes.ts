import express from "express";
const router = express.Router();
import {
  createCart,
  getCartByUserId,
  addOrUpdateProductInCart,
  removeProductFromCart,
} from "../controllers/cart.controller";

// Create a new cart for a user
router.post("/:userId", createCart);

// Get a user's cart
router.get("/:userId", getCartByUserId);

// Add or update a product in the cart
router.put("/:userId/:productId", addOrUpdateProductInCart);

// Remove a product from the cart
router.delete("/:userId/:productId", removeProductFromCart);

export default router;

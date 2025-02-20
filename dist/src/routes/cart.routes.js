"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const cart_controller_1 = require("../controllers/cart.controller");
// Create a new cart for a user
router.post("/:userId", cart_controller_1.createCart);
// Get a user's cart
router.get("/:userId", cart_controller_1.getCartByUserId);
// Add or update a product in the cart
router.put("/:userId/:productId", cart_controller_1.addOrUpdateProductInCart);
// Remove a product from the cart
router.delete("/:userId/:productId", cart_controller_1.removeProductFromCart);
exports.default = router;

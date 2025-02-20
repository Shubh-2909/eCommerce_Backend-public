"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.placeOrder = void 0;
const order_model_1 = require("../models/order.model");
const cart_models_1 = require("../models/cart.models");
const placeOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartId } = req.params;
        console.log(cartId);
        const { shippingAddress, paymentMethod } = req.body;
        const cart = yield cart_models_1.Cart.findById(cartId).populate("items.product", "price name");
        if (!cart) {
            return res
                .status(404)
                .json({ success: false, message: "Cart not found" });
        }
        // Calculate the total price
        const totalPrice = cart.items.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);
        // Create the order
        const order = new order_model_1.Order({
            user: cart.user, // Associate the order with the user who owns the cart
            cart: cartId, // Reference the cart
            items: cart.items.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
            })),
            totalPrice,
            shippingAddress,
            paymentMethod,
        });
        // Save the order
        yield order.save();
        // Optionally, clear the cart after placing the order
        cart.items = [];
        yield cart.save();
        res.status(201).json({ success: true, data: order });
    }
    catch (error) {
        next(error);
    }
});
exports.placeOrder = placeOrder;
const deleteOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, userId } = req.params;
        console.log(orderId);
        console.log(userId);
        // Find the order and ensure it belongs to the user
        const order = yield order_model_1.Order.findOneAndUpdate({ _id: orderId, user: userId }, // Find the order by ID and user
        { status: "Cancelled" }, // Update the status to "Cancelled"
        { new: true } // Return the updated order
        );
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found or does not belong to the user",
            });
        }
        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order,
        });
    }
    catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
});
exports.deleteOrder = deleteOrder;

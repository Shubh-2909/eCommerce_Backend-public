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
exports.removeProductFromCart = exports.addOrUpdateProductInCart = exports.getCartByUserId = exports.createCart = void 0;
const cart_models_1 = require("../models/cart.models");
const createCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const newCart = new cart_models_1.Cart({ user: userId, items: [] });
        yield newCart.save();
        res.status(201).json({ success: true, data: newCart });
    }
    catch (error) {
        next(error);
    }
});
exports.createCart = createCart;
const getCartByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const cart = yield cart_models_1.Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            return res
                .status(404)
                .json({ success: false, message: "Cart not found" });
        }
        res.status(200).json({ success: true, data: cart });
    }
    catch (error) {
        next(error);
    }
});
exports.getCartByUserId = getCartByUserId;
const addOrUpdateProductInCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId } = req.params;
        let cart = yield cart_models_1.Cart.findOne({ user: userId });
        if (!cart) {
            cart = new cart_models_1.Cart({ user: userId, items: [] });
        }
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += 1;
        }
        else {
            cart.items.push({ product: productId, quantity: 1 });
        }
        yield cart.save();
        res.status(200).json({ success: true, data: cart });
    }
    catch (error) {
        next(error);
    }
});
exports.addOrUpdateProductInCart = addOrUpdateProductInCart;
const removeProductFromCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId } = req.params;
        // Find the cart for the user
        const cart = yield cart_models_1.Cart.findOne({ user: userId });
        if (!cart) {
            return res
                .status(404)
                .json({ success: false, message: "Cart not found" });
        }
        // Find the product in the cart
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found in cart" });
        }
        // Decrease the quantity by 1
        cart.items[itemIndex].quantity -= 1;
        // If the quantity reaches 0, remove the product from the cart
        if (cart.items[itemIndex].quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        }
        // Save the updated cart
        yield cart.save();
        // Send the response
        res.status(200).json({ success: true, data: cart });
    }
    catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
});
exports.removeProductFromCart = removeProductFromCart;

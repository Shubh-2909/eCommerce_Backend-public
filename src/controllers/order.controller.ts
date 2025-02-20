import { Order } from "../models/order.model";
import { Cart } from "../models/cart.models";
import { Document } from "mongoose";

interface ProductDocument extends Document {
  price: number;
  name: string;
}

interface CartItem {
  product: ProductDocument;
  quantity: number;
}

export const placeOrder = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    console.log(cartId);
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findById(cartId).populate<{ items: CartItem[] }>(
      "items.product",
      "price name"
    );
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
    const order = new Order({
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
    await order.save();

    // Optionally, clear the cart after placing the order
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { orderId, userId } = req.params;
    console.log(orderId);
    console.log(userId);

    // Find the order and ensure it belongs to the user
    const order = await Order.findOneAndUpdate(
      { _id: orderId, user: userId }, // Find the order by ID and user
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
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

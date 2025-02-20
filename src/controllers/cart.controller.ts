import { Cart } from "../models/cart.models";

export const createCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const newCart = new Cart({ user: userId, items: [] });
    await newCart.save();
    res.status(201).json({ success: true, data: newCart });
  } catch (error) {
    next(error);
  }
};

export const getCartByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

export const addOrUpdateProductInCart = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

export const removeProductFromCart = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;

    // Find the cart for the user
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Find the product in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

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
    await cart.save();

    // Send the response
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};

import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { items } = req.body;

    // Validate input
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Invalid input format",
      });
    }
    if (
      !items.every(
        (item) => item.quantity > 0 && Number.isInteger(item.quantity)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity. Must be a positive integer.",
      });
    }
    // Aggregate quantities for the same productId
    const quantityMap = items.reduce((acc, item) => {
      acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
      return acc;
    }, {});

    // Convert quantityMap to an array of items
    const aggregatedItems = Object.entries(quantityMap).map(
      ([productId, quantity]) => ({
        productId,
        quantity,
      })
    );

    // Extract productIds and quantities after aggregation
    const productIds = aggregatedItems.map((item) => item.productId);
    const quantities = Object.fromEntries(
      aggregatedItems.map((item) => [item.productId, item.quantity])
    );

    // Fetch all products in one query
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !==  productIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more products not found",
      });
    }

    // Calculate total prices for the new items
    const itemPrices = products.map((product) => ({
      product: product._id,
      quantity: quantities[product._id],
      price: product.price * quantities[product._id],
    }));

    const newTotalPrice = itemPrices.reduce(
      (total, item) => total + item.price,
      0
    );

    // Find or create the user's cart
    let cart = await Cart.findOne({ user: req.id });
    if (!cart) {
      cart = await Cart.create({
        user: req.id,
        items: itemPrices.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        totalPrice: newTotalPrice,
      });
    } else {
      // Update the cart
      for (const newItem of itemPrices) {
        const existingItem = cart.items.find(
          (item) => item.product.toString() === newItem.product.toString()
        );
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          cart.items.push({
            product: newItem.product,
            quantity: newItem.quantity,
          });
        }
      }

      // Recalculate total price
      cart.totalPrice += newTotalPrice;
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Products added to cart",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!req.id) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const cart = await Cart.findOne({ user: req.id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Remove the product from the cart
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    // Recalculate the total price
    const productIds = cart.items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = Object.fromEntries(
      products.map((p) => [p._id.toString(), p])
    );
    cart.totalPrice = cart.items.reduce(
      (sum, item) =>
        sum + productMap[item.product.toString()].price * item.quantity,
      0
    );

    await cart.save();
    return res
      .status(200)
      .json({ success: true, message: "Product removed from cart", cart });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get the user's cart
export const getCart = async (req, res) => {
  try {
    if (!req.id) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const cart = await Cart.findOne({ user: req.id }).populate("items.product");
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Update quantity of an existing cart item
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Quantity must be greater than 0" });
    }

    if (!req.id) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: req.id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Find the item in the cart
    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart" });
    }

    // Update the quantity of the product
    item.quantity = quantity;

    // Recalculate the total price
    const productIds = cart.items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = Object.fromEntries(
      products.map((p) => [p._id.toString(), p])
    );
    cart.totalPrice = cart.items.reduce(
      (sum, item) =>
        sum + productMap[item.product.toString()].price * item.quantity,
      0
    );

    await cart.save();
    return res
      .status(200)
      .json({ success: true, message: "Cart item updated", cart });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


// Clear cart after payment
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.findOneAndDelete({ userId });
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
    addToCart,
    removeFromCart,
    getCart,
    updateCartItem,
    clearCart
} from "../controllers/cart.controller.js";

const router = express.Router();

// Protected Routes
router.post("/add", isAuthenticated, addToCart);
router.delete("/remove/:productId", isAuthenticated, removeFromCart);
router.get("/", isAuthenticated, getCart);
router.put("/update/:productId", isAuthenticated, updateCartItem);
router.delete("/clear", isAuthenticated, clearCart);

export default router;

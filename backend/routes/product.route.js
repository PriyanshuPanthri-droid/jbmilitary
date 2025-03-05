import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getSoldProducts
} from "../controllers/product.controller.js";

const router = express.Router();

// Public Routes
router.get("/allProducts", getAllProducts);
router.get("/soldProducts", getSoldProducts);
router.get("/:id", getProductById);

// Protected Routes for Admins
router.post("/create", isAuthenticated, createProduct);
router.put("/update/:id", isAuthenticated, updateProduct);
router.delete("/delete/:id", isAuthenticated, deleteProduct);

export default router;

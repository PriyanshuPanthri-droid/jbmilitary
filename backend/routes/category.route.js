import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

// Protected Routes for Admins
router.post("/create", isAuthenticated, createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/update/:id", isAuthenticated, updateCategory);
router.delete("/delete/:id", isAuthenticated, deleteCategory);

export default router;

import { Category } from "../models/category.model.js";
import { isValidCategoryName } from "../utils/validations/commonValidations.js"; 

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if category name is provided
        if (!name) {
            return res.status(400).json({ 
                success: false, 
                message: "Category name is required" 
            });
        }

        // Validate category name format
        if (!isValidCategoryName(name)) {
            return res.status(400).json({
                success: false,
                message: "Category name must be a string between 3 and 100 characters"
            });
        }

        // Check if the category already exists (case-insensitive)
        const existingCategory = await Category.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
        if (existingCategory) {
            return res.status(400).json({ 
                success: false, 
                message: "Category with this name already exists" 
            });
        }

        // Create the new category
        const category = await Category.create({ name });
        return res.status(201).json({ 
            success: true, 
            message: "Category created successfully", 
            category 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({ 
            success: true, 
            categories 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!isValidObjectId(id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid category ID format" 
            });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ 
                success: false, 
                message: "Category not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            category 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Validate ObjectId format
        if (!isValidObjectId(id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid category ID format" 
            });
        }

        // Check if category name is provided
        if (!name) {
            return res.status(400).json({ 
                success: false, 
                message: "Category name is required" 
            });
        }

        // Validate category name format
        if (!isValidCategoryName(name)) {
            return res.status(400).json({
                success: false,
                message: "Category name must be a string between 3 and 100 characters"
            });
        }

        // Check if category with this name already exists (except for the current category)
        const existingCategory = await Category.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
        if (existingCategory && existingCategory._id.toString() !== id) {
            return res.status(400).json({ 
                success: false, 
                message: "Category with this name already exists" 
            });
        }

        // Update the category
        const category = await Category.findByIdAndUpdate(id, { name }, { new: true });

        if (!category) {
            return res.status(404).json({ 
                success: false, 
                message: "Category not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Category updated successfully", 
            category 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!isValidObjectId(id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid category ID format" 
            });
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ 
                success: false,
                message: "Category not found" 
            });
        }

        return res.status(200).json({ 
            success: true,
            message: "Category deleted successfully" 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

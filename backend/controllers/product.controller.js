import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { isValidObjectId } from "../utils/validations/commonValidations.js";
import { validateCreateProduct, validateUpdateProduct } from "../utils/validations/productValidations.js";

// Create a new product
export const createProduct = async (req, res) => {
    try {
        const validation = validateCreateProduct(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ success: false, errors: validation.errors });
        }

        const { name, description, price, categoryName, stock, images, sold = false } = req.body;
        let category = await Category.findOne({ name: categoryName });
        
        if (!category) {
            // If category does not exist, create it
            category = await Category.create({ name: categoryName });
        }
        
        // Create product
        const product = await Product.create({ name, description, price, category, stock, images, sold });

        const populatedProduct = await Product.findById(product._id)
            .populate('category', 'name')
            .lean();

        return res.status(201).json({ 
            success: true, 
            message: "Product created successfully", 
            product: populatedProduct
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get all products with pagination, filtering, and sorting
export const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = "price", order = "asc", category, priceMin, priceMax, stockMin, sold } = req.query;

        // Build filters
        const filters = {};
        if (category) filters["category.name"] = category;
        if (priceMin || priceMax) filters.price = {};
        if (priceMin) filters.price.$gte = priceMin;
        if (priceMax) filters.price.$lte = priceMax;
        if (stockMin) filters.stock = { $gte: stockMin };
        if (sold !== undefined) filters.sold = sold === "true";

        // Pagination logic
        const skip = (page - 1) * limit;

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = order === "asc" ? 1 : -1;

        // Get products with filters, pagination, and sorting
        const products = await Product.find(filters)
            .populate("category", "name") 
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean();
        
        const total = await Product.countDocuments(filters);

        return res.status(200).json({ 
            success: true, 
            products, 
            page: Number(page), 
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)) 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get all sold products 
export const getSoldProducts = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            sortBy = "updatedAt", 
            order = "desc", 
            category,
            priceMin,
            priceMax
        } = req.query;

        const filters = { sold: true };
        if (category) filters["category.name"] = category;
        if (priceMin || priceMax) filters.price = {};
        if (priceMin) filters.price.$gte = Number(priceMin);
        if (priceMax) filters.price.$lte = Number(priceMax);

        const skip = (page - 1) * Number(limit);
        const sortOptions = { [sortBy]: order === "asc" ? 1 : -1 };

        const products = await Product.find(filters)
            .populate("category", "name")
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit))
            .lean();

        const total = await Product.countDocuments(filters);

        return res.status(200).json({ 
            success: true, 
            products, 
            page: Number(page), 
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit))
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get a product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid product ID" 
            });
        }

        const product = await Product.findById(id).populate("category", "name").lean();
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }

        // Related products (products in the same category)
        const relatedProducts = await Product.find({ category: product.category._id, _id: { $ne: id }, sold:false })
        .populate("category", "name")
        .limit(5)
        .lean(); 

        return res.status(200).json({ 
            success: true, 
            product, 
            relatedProducts 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

// Update product details
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const validation = validateUpdateProduct(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ success: false, errors: validation.errors });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Product updated successfully", 
            product: updatedProduct 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid product ID" 
            });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Product deleted successfully" 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
};

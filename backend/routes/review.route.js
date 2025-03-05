import express from "express";
import { param, body } from "express-validator";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    createReview,
    updateReview,
    deleteReview,
    getAllReviews,
} from "../controllers/review.controller.js";
import { validateRequest } from "../middlewares/validator.js";

const router = express.Router();

// Create a new review
router.post(
    "/create/:productId",
    isAuthenticated,
    [
        param("productId").isMongoId().withMessage("Invalid product ID"),
        body("rating")
            .isNumeric()
            .withMessage("Rating must be a number")
            .isInt({ min: 1, max: 5 })
            .withMessage("Rating must be between 1 and 5"),
        body("comment").trim().notEmpty().withMessage("Comment is required")
    ],
    validateRequest,
    createReview
);

// Update a review
router.put(
    "/update/:productId/:reviewId",
    isAuthenticated,
    [
        param("productId").isMongoId().withMessage("Invalid product ID"),
        param("reviewId").isMongoId().withMessage("Invalid review ID"),
        body("rating")
            .optional()
            .isNumeric()
            .withMessage("Rating must be a number")
            .isInt({ min: 1, max: 5 })
            .withMessage("Rating must be between 1 and 5"),
        body("comment")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Comment cannot be empty")
    ],
    validateRequest,
    updateReview
);

// Delete a review
router.delete(
    "/delete/:productId/:reviewId",
    isAuthenticated,
    [
        param("productId").isMongoId().withMessage("Invalid product ID"),
        param("reviewId").isMongoId().withMessage("Invalid review ID")
    ],
    validateRequest,
    deleteReview
);

// Get all reviews for a product
router.get(
    "/:productId",
    [
        param("productId").isMongoId().withMessage("Invalid product ID")
    ],
    validateRequest,
    getAllReviews
);

export default router;

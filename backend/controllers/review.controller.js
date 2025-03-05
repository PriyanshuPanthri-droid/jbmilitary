import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export const createReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;

        // Start a session for the transaction
        const session = await Review.startSession();
        session.startTransaction();

        try {
            const product = await Product.findById(productId).session(session);
            if (!product) {
                await session.abortTransaction();
                return res.status(404).json({ success: false, message: "Product not found" });
            }

            // Check if user already reviewed this product
            const existingReview = await Review.findOne({
                product: productId,
                user: req.id
            }).session(session);

            if (existingReview) {
                await session.abortTransaction();
                return res.status(400).json({
                    success: false,
                    message: "You have already reviewed this product"
                });
            }

            // Create the review
            const review = await Review.create([{
                product: productId,
                user: req.id,
                rating,
                comment
            }], { session });

            // Update product's reviews and recalculate average rating
            const allProductReviews = await Review.find({ product: productId }).session(session);
            const averageRating = allProductReviews.reduce((acc, curr) => acc + curr.rating, 0) / allProductReviews.length;

            await Product.findByIdAndUpdate(
                productId,
                {
                    $push: { reviews: review[0]._id },
                    $set: { averageRating: Number(averageRating.toFixed(1)) }
                },
                { session }
            );

            await session.commitTransaction();

            return res.status(201).json({
                success: true,
                message: "Review added successfully",
                review: review[0]
            });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { productId, reviewId } = req.params;
        const { rating, comment } = req.body;

        const session = await Review.startSession();
        session.startTransaction();

        try {
            const review = await Review.findById(reviewId).session(session);
            if (!review || review.product.toString() !== productId) {
                await session.abortTransaction();
                return res.status(404).json({
                    success: false,
                    message: "Review not found"
                });
            }

            if (review.user.toString() !== req.id) {
                await session.abortTransaction();
                return res.status(403).json({
                    success: false,
                    message: "You can only update your own review"
                });
            }

            // Update the review
            review.rating = rating;
            review.comment = comment;
            await review.save({ session });

            // Recalculate average rating
            const allProductReviews = await Review.find({ product: productId }).session(session);
            const averageRating = allProductReviews.reduce((acc, curr) => acc + curr.rating, 0) / allProductReviews.length;

            await Product.findByIdAndUpdate(
                productId,
                { averageRating: Number(averageRating.toFixed(1)) },
                { session }
            );

            await session.commitTransaction();

            return res.status(200).json({
                success: true,
                message: "Review updated successfully",
                review
            });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { productId, reviewId } = req.params;

        const session = await Review.startSession();
        session.startTransaction();

        try {
            const review = await Review.findById(reviewId).session(session);
            if (!review || review.product.toString() !== productId) {
                await session.abortTransaction();
                return res.status(404).json({
                    success: false,
                    message: "Review not found"
                });
            }

            if (review.user.toString() !== req.id) {
                await session.abortTransaction();
                return res.status(403).json({
                    success: false,
                    message: "You can only delete your own review"
                });
            }

            // Remove the review
            await review.remove({ session });

            // Update product's reviews array and recalculate average rating
            const allProductReviews = await Review.find({ product: productId }).session(session);
            const averageRating = allProductReviews.length > 0
                ? allProductReviews.reduce((acc, curr) => acc + curr.rating, 0) / allProductReviews.length
                : 0;

            await Product.findByIdAndUpdate(
                productId,
                {
                    $pull: { reviews: reviewId },
                    averageRating: Number(averageRating.toFixed(1))
                },
                { session }
            );

            await session.commitTransaction();

            return res.status(200).json({
                success: true,
                message: "Review deleted successfully"
            });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const reviews = await Review.find({ product: productId })
            .populate("user", "fullName avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments({ product: productId });

        return res.status(200).json({
            success: true,
            reviews,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
import { Wishlist } from "../models/wishlist.model.js";
import { User } from "../models/user.model.js";

// Utility function to check if product exists in wishlist
const checkProductInWishlist = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({
    userId,
    "products.productId": productId,
  });
  return !!wishlist;
};

// Fetch wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.id; 
    const wishlist = await Wishlist.findOne({ userId }).populate(
      "products.productId",
      "name price images description stock"
    );

    res.status(200).json({
      success: true,
      data: wishlist || { userId, products: [] },
      message: "Wishlist fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
};


// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.id; 
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check if product is already in the wishlist before adding
    const exists = await checkProductInWishlist(userId, productId);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Product is already in your wishlist",
      });
    }

    // Start a session for the transaction
    const session = await Wishlist.startSession();
    session.startTransaction();

    try {
      // Update wishlist
      const updatedWishlist = await Wishlist.findOneAndUpdate(
        { userId },
        {
          $addToSet: {
            products: {
              productId,
              addedAt: new Date(),
            },
          },
        },
        { upsert: true, new: true, session }
      ).populate("products.productId", "name price images description stock");

      // Update user's wishlist reference
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: productId } },
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();

      res.status(200).json({
        success: true,
        data: updatedWishlist,
        message: "Product added to wishlist successfully",
      });
    } catch (error) {
      // If error occurs, abort transaction
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist",
    });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.id; 
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check if product is already in the wishlist before proceeding with removal
    const exists = await checkProductInWishlist(userId, productId);
    if (!exists) {
      return res.status(400).json({
        success: false,
        message: "Product is not in your wishlist",
      });
    }


    const session = await Wishlist.startSession();
    session.startTransaction();

    try {
      // Update wishlist
      const updatedWishlist = await Wishlist.findOneAndUpdate(
        { userId },
        { $pull: { products: { productId } } },
        { new: true, session }
      ).populate("products.productId", "name price images description stock");

      // Update user's wishlist reference
      await User.findByIdAndUpdate(
        userId,
        { $pull: { wishlist: productId } },
        { session }
      );

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        data: updatedWishlist,
        message: "Product removed from wishlist successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove product from wishlist",
    });
  }
};

// Check if product is in wishlist
export const isProductInWishlist = async (req, res) => {
  try {
    const userId = req.id; 
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const isInWishlist = await checkProductInWishlist(userId, productId);

    res.status(200).json({
      success: true,
      isInWishlist,
      message: "Wishlist check completed successfully",
    });
  } catch (error) {
    console.error("Error checking wishlist status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check wishlist status",
    });
  }
};


// Clear wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.id; 

    const session = await Wishlist.startSession();
    session.startTransaction();

    try {
      // Clear wishlist
      await Wishlist.findOneAndUpdate(
        { userId },
        { $set: { products: [] } },
        { session }
      );

      // Clear user's wishlist reference
      await User.findByIdAndUpdate(
        userId,
        { $set: { wishlist: [] } },
        { session }
      );

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: "Wishlist cleared successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear wishlist",
    });
  }
};
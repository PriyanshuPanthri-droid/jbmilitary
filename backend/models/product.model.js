import mongoose from "mongoose";

// Product Schema with enhancements
const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true, 
      unique: true, 
      index: true, // Add index for performance on searches by name
    },
    description: { 
      type: String, 
      required: true 
    },
    images: [
      { 
        type: String, 
        required: true, 
      }
    ],
    price: { 
      type: Number, 
      required: true, 
      min: [0, 'Price cannot be less than 0'], 
      index: true 
    },
    stock: { 
      type: Number, 
      required: true, 
      min: [0, 'Stock cannot be less than 0'], 
    },
    category: { 
      type: mongoose.Schema.Types.ObjectId, // Reference to Category model
      ref: "Category", 
      required: true
      // type: String, required: true
    },
    averageRating: { 
      type: Number, 
      default: 0, 
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be greater than 5'], 
    },
    reviews: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Review" 
    }],
    sold: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, price: 1 });
productSchema.index({ sold: 1 });;

export const Product = mongoose.model("Product", productSchema);

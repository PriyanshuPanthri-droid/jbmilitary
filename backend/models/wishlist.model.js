import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Ensure a user can't add the same product multiple times
wishlistSchema.index({ userId: 1, 'products.productId': 1 }, { unique: true });

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
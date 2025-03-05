import express from 'express';
import { body, param } from 'express-validator';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { validateRequest } from '../middlewares/validator.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isProductInWishlist,
  clearWishlist
} from '../controllers/wishlist.controller.js';

const router = express.Router();

// Get user's wishlist
router.get('/', isAuthenticated, getWishlist);

// Add product to wishlist
router.post('/add', 
  isAuthenticated,
  [
    body('productId')
      .isMongoId()
      .withMessage('Invalid product ID')
  ],
  validateRequest,
  addToWishlist
);

// Remove product from wishlist
router.delete('/remove/:productId',
  isAuthenticated,
  [
    param('productId')
      .isMongoId()
      .withMessage('Invalid product ID')
  ],
  validateRequest,
  removeFromWishlist
);

// Check if product is in wishlist
router.get('/check/:productId',
  isAuthenticated,
  [
    param('productId')
      .isMongoId()
      .withMessage('Invalid product ID')
  ],
  validateRequest,
  isProductInWishlist
);

// Clear wishlist
router.delete('/clear', isAuthenticated, clearWishlist);

export default router;
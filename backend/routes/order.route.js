import express from 'express';
import { body, param } from 'express-validator';
import { 
  getUserOrders, 
  getOrderDetails, 
  updateOrderStatus, 
  cancelOrder, 
  getOrderStats 
} from '../controllers/order.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { validateRequest } from '../middlewares/validator.js';

const router = express.Router();


// Get all orders for a user
router.get('/user', isAuthenticated, getUserOrders);

// Get order statistics (accessible to all authenticated users for now)
router.get('/stats', isAuthenticated, getOrderStats);

// Get a single order's details
router.get('/:orderId', isAuthenticated, getOrderDetails);

// Update order status
router.put(
  '/:orderId/status',
  isAuthenticated,
  [
    param('orderId').isMongoId().withMessage('Invalid order ID'),
    body('status')
      .isIn(['CREATED', 'APPROVED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
      .withMessage('Invalid order status'),
    body('trackingNumber').optional().isString().trim()
  ],
  validateRequest,
  updateOrderStatus
);

// Cancel an order
router.post('/:orderId/cancel', isAuthenticated, cancelOrder);

export default router;

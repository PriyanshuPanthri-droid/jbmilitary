import express from 'express';
import { body, param } from 'express-validator';
import { createPayPalOrder, capturePayPalOrder, cancelPayPalOrder, refundPayPalOrder, validatePayPalOrder } from "../controllers/paypal.controller.js"
import isAuthenticated from '../middlewares/isAuthenticated.js';
const router = express.Router();

// Create PayPal Order
router.post(
  '/create-paypal-order',
  isAuthenticated,
  [
    body('items').isArray().notEmpty().withMessage('Items are required'),
    body('items.*.productId').isString().notEmpty().withMessage('Product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  createPayPalOrder
);

// Capture PayPal Order
router.post(
  '/capture-paypal-order/:orderId',
  isAuthenticated,
  [
    param('orderId').isString().notEmpty().withMessage('PayPal order ID is required')
  ],
  capturePayPalOrder
);

// Cancel PayPal Order
router.post(
  '/cancel-paypal-order/:orderId',
  isAuthenticated,
  [
    param('orderId').isString().notEmpty().withMessage('PayPal order ID is required')
  ],
  cancelPayPalOrder
);

// Refund PayPal Order
router.post(
  '/refund-paypal-order/:orderId',
  isAuthenticated,
  [
    param('orderId').isString().notEmpty().withMessage('PayPal order ID is required'),
    body('amount').isDecimal().withMessage('Amount is required and should be a valid number'),
    body('reason').isString().notEmpty().withMessage('Reason for refund is required')
  ],
  refundPayPalOrder
);

// Validate PayPal Order
router.get(
  '/validate-paypal-order/:orderId',
  isAuthenticated,
  [
    param('orderId').isString().notEmpty().withMessage('PayPal order ID is required')
  ],
  validatePayPalOrder
);


export default router;

import { createOrder, captureOrder, cancelOrder, refundOrder, validateOrder } from '../services/paypal.service.js';
import { validationResult } from 'express-validator';

// Create a PayPal order
export const createPayPalOrder  = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items } = req.body;
    const userId = req.id;

    const order = await createOrder(items, userId);
    res.json(order.result);
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Capture a PayPal order
export const capturePayPalOrder  = async (req, res) => {
  try {
    const { orderId } = req.params;
    const capture = await captureOrder(orderId);
    res.json(capture.result);
  } catch (error) {
    console.error('Capture Order Error:', error);
    res.status(500).json({ error: 'Failed to capture order' });
  }
};

// Cancel a PayPal order
export const cancelPayPalOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await cancelOrder(orderId);
    res.json({ message: 'Order canceled successfully', result });
  } catch (error) {
    console.error('Cancel Order Error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

// Refund a PayPal order
export const refundPayPalOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount, reason } = req.body;

    const refund = await refundOrder(orderId, amount, reason);
    res.json({ message: 'Order refunded successfully', refund });
  } catch (error) {
    console.error('Refund Order Error:', error);
    res.status(500).json({ error: 'Failed to refund order' });
  }
};

// Validate a PayPal order
export const validatePayPalOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await validateOrder(orderId);
    res.json({ message: 'Order validation successful', order: order.result });
  } catch (error) {
    console.error('Validate Order Error:', error);
    res.status(500).json({ error: 'Failed to validate order' });
  }
};

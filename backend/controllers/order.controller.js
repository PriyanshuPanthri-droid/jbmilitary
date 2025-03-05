import { Order } from '../models/order.model.js';
import { validationResult } from 'express-validator';

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate('items.productId');

    res.json(orders);
  } catch (error) {
    console.error('Get User Orders Error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get single order details
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('items.productId');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the order belongs to the requesting user
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access to order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get Order Details Error:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the order belongs to the requesting user
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access to order' });
    }

    // Only allow cancellation of orders that haven't been shipped
    if (!['CREATED', 'APPROVED', 'COMPLETED'].includes(order.status)) {
      return res.status(400).json({
        error: 'Cannot cancel order in current status',
      });
    }

    order.status = 'CANCELLED';
    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Cancel Order Error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

// Get order statistics (admin only)
export const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Get Order Stats Error:', error);
    res.status(500).json({ error: 'Failed to fetch order statistics' });
  }
};

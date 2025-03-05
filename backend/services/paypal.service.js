import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { paypalClient } from '../config/paypal.config.js';
import { Order } from '../models/order.model.js';

// Create a PayPal order
export const createOrder = async (items, userId) => {
  try {
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: totalAmount.toString(),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: totalAmount.toString(),
              },
            },
          },
          items: items.map((item) => ({
            name: item.name,
            unit_amount: {
              currency_code: 'USD',
              value: item.price.toString(),
            },
            quantity: item.quantity.toString(),
          })),
        },
      ],
      // application_context: {
      //   shipping_preference: 'NO_SHIPPING',
      //   user_action: 'PAY_NOW',
      //   return_url: process.env.PAYPAL_RETURN_URL,
      //   cancel_url: process.env.PAYPAL_CANCEL_URL,
      // },
    });

    const order = await paypalClient.execute(request);

    // Save the order to the database
    await Order.create({
      paypalOrderId: order.result.id,
      userId,
      items,
      totalAmount,
      status: 'CREATED',
    });

    return order;
  } catch (error) {
    console.error('PayPal Create Order Error:', error);
    throw new Error('Failed to create PayPal order');
  }
};

// Validate order before capture
export const validateOrder = async (orderId) => {
  try {
    const request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);
    const order = await paypalClient.execute(request);

    // Ensure the order is approved before capturing it
    if (order.result.status !== 'APPROVED') {
      throw new Error('Order not approved for capture');
    }

    return order;
  } catch (error) {
    console.error('PayPal Validate Order Error:', error);
    throw new Error('Failed to validate PayPal order');
  }
};

// Capture a PayPal order
export const captureOrder = async (orderId) => {
  try {
    // Validate the order before capture
    await validateOrder(orderId);

    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    const capture = await paypalClient.execute(request);

    // Update the order status to completed and save payment details
    await Order.findOneAndUpdate(
      { paypalOrderId: orderId },
      {
        status: 'COMPLETED',
        paymentDetails: capture.result,
      }
    );

    return capture;
  } catch (error) {
    console.error('PayPal Capture Order Error:', error);

    // Update order status to 'FAILED' in case of an error
    await Order.findOneAndUpdate(
      { paypalOrderId: orderId },
      { status: 'FAILED' }
    );

    throw new Error('Failed to capture PayPal order');
  }
};

// Refund a PayPal order

export const refundOrder = async (orderId, amount, reason) => {
  try {
    // Fetch the order from the database
    const order = await Order.findOne({ paypalOrderId: orderId });
    
    // Check if order exists and is eligible for refund (only COMPLETED orders are refundable)
    if (!order || order.status !== 'COMPLETED') {
      throw new Error('Order not eligible for refund');
    }

    // Fetch the capture information from paymentDetails
    const capture = order.paymentDetails.purchase_units[0].payments.captures[0];
    if (!capture) {
      throw new Error('No capture found for this order');
    }

    // Prepare the refund request with the capture ID
    const request = new checkoutNodeJssdk.payments.CapturesRefundRequest(capture.id);
    request.requestBody({
      amount: {
        currency_code: 'USD',
        value: amount.toString(),
      },
      note_to_payer: reason,
    });

    // Execute the refund request
    const refund = await paypalClient.execute(request);

    // Update the order status and log the refund details
    await Order.findOneAndUpdate(
      { paypalOrderId: orderId },
      {
        status: 'REFUNDED', // Update order status to REFUNDED
        $push: {
          refundDetails: { // Add refund details to the order
            refundId: refund.result.id,
            amount,
            reason,
            status: refund.result.status, 
            createdAt: new Date(),
          },
        },
      }
    );

    return refund; 
  } catch (error) {
    console.error('PayPal Refund Error:', error);
    throw new Error('Failed to refund PayPal order'); 
  }
};

// Cancel a PayPal order
export const cancelOrder = async (orderId) => {
  try {
    const order = await Order.findOne({ paypalOrderId: orderId });
    if (!order || order.status !== 'CREATED') {
      throw new Error('Order not eligible for cancellation');
    }

    await Order.findOneAndUpdate(
      { paypalOrderId: orderId },
      {
        status: 'CANCELLED',
        updatedAt: new Date(),
      }
    );

    return { success: true, message: 'Order cancelled successfully' };
  } catch (error) {
    console.error('PayPal Cancel Order Error:', error);
    throw new Error('Failed to cancel PayPal order');
  }
};

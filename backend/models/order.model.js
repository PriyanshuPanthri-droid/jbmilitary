import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  paypalOrderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['CREATED', 'APPROVED', 'COMPLETED', 'FAILED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'CREATED'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  trackingNumber: String,
  paymentDetails: {
    type: Object
  },
  refundDetails: [{
    refundId: String,
    amount: Number,
    reason: String,
    status: String,
    createdAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

orderSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Order = mongoose.model("Order", orderSchema);

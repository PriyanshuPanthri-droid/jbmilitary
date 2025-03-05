import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  isSubscribed: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  lastEmailSent: {
    type: Date
  }
});

export default mongoose.model('Newsletter', newsletterSchema);
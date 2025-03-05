import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
  auctionNumber: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  catalogueUrl: {
    type: String,
    // required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'past'],
    default: 'upcoming'
  },
  year: {
    type: Number,
    required: true,
    default: function() {
      return this.date.getFullYear(); 
    }
  }
}, {
  timestamps: true
});

// Auto-update status based on date
auctionSchema.pre('save', function(next) {
  this.status = new Date(this.date) > new Date() ? 'upcoming' : 'past';
  next();
});

export default mongoose.model('Auction', auctionSchema);
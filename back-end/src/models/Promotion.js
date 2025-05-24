import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  conditions: {
    minStay: {
      type: Number,
      default: 1
    },
    maxDiscount: {
      type: Number
    },
    applicableDays: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware để cập nhật updatedAt
promotionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Kiểm tra thời gian hợp lệ
promotionSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    next(new Error('Thời gian kết thúc phải sau thời gian bắt đầu'));
  }
  next();
});

const Promotion = mongoose.model('Promotion', promotionSchema);

export default Promotion; 
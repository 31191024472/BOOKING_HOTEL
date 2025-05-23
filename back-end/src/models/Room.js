import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  hotelCode: {
    type: Number,
    required: true,
    ref: "Hotel",
  },
  roomType: {
    type: String,
    required: true,
    enum: ["Standard", "Deluxe", "Suite", "Executive"],
  },
  description: {
    type: String,
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  maxOccupancy: {
    type: Number,
    required: true,
    default: 2,
  },
  bedType: {
    type: String,
    required: true,
  },
  amenities: [
    {
      type: String,
    },
  ],
  totalRooms: {
    type: Number,
    required: true,
    default: 1,
  },
  availableRooms: {
    type: Number,
    required: true,
    default: 1,
  },
  imageUrls: [
    {
      type: String,
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  discount: {
    percentage: {
      type: Number,
      default: 0,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Cập nhật updatedAt trước khi lưu
roomSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Room", roomSchema);

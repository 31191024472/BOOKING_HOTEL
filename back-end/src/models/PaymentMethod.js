import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cardType: { type: String, required: true },
  cardNumber: { type: String, required: true },
  expiryDate: { type: String, required: true },
  nameOnCard: { type: String, required: true },
  billingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Cập nhật updatedAt trước khi lưu
paymentMethodSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("PaymentMethod", paymentMethodSchema, "PaymentMethods");

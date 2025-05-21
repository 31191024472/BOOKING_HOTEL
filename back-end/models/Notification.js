import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Gửi cho ai
  title: String,                            // Tiêu đề thông báo
  message: String,                          // Nội dung
  type: { type: String, enum: ['booking', 'payment', 'system'], default: 'system' }, // Loại thông báo
  isRead: { type: Boolean, default: false },  // Đánh dấu đã đọc
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);

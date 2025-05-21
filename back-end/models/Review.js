import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true }, // Liên kết Hotel
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },                   // Người viết review (nếu có)
  reviewerName: String,              // Tên người đánh giá
  rating: { type: Number, min: 1, max: 5, required: true },  // ⭐ Số sao (1-5)
  review: String,                    // Nội dung đánh giá
  date: { type: Date, default: Date.now },  // Ngày review
  verified: { type: Boolean, default: false } // Có xác thực đặt phòng không
});

export default mongoose.model('Review', reviewSchema);

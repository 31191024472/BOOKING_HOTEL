import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    hotelCode: { type: Number, required: true, unique: true }, // Mã định danh riêng cho khách sạn
    title: { type: String, required: true }, // Tên khách sạn
    subtitle: { type: String }, // Mô tả ngắn hoặc địa chỉ
    description: { type: String }, // Mô tả chi tiết về khách sạn
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    }, // Tham chiếu đến City
    propertyType: { type: String, required: true }, // Loại khách sạn (Hotel, Resort, etc.)
    benefits: [{ type: String }], // Danh sách các tiện ích chung (free wifi, hồ bơi,...)
    ratings: { type: Number, default: 0 }, // Điểm đánh giá trung bình
    imageUrls: [{ type: String }], // Mảng URL hình ảnh của khách sạn
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
    partner_id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    } ,// Danh sách các phòng của khách sạn
    status: {type: String, default : 'Chưa xét duyệt'},
    createdAt: { type: Date, default: Date.now }, // Thời gian tạo
    updatedAt: { type: Date, default: Date.now }, // Thời gian cập nhật
    address: { type: String, default: 'Chưa Cập Nhật' },
  },
  {
    timestamps: true, // Tự động cập nhật createdAt và updatedAt
  }
);

// // Thêm index cho các trường thường xuyên tìm kiếm
// hotelSchema.index({ hotelCode: 1 });
// hotelSchema.index({ cityId: 1 });
// hotelSchema.index({ propertyType: 1 });
// hotelSchema.index({ ratings: 1 });

export default mongoose.model("Hotel", hotelSchema);

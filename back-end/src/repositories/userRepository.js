import User from '../models/User.js';
import Booking from '../models/Booking.js';
import PaymentMethod from "../models/PaymentMethod.js"
import mongoose from 'mongoose';

// Tìm user theo email
const findByEmail = (email) => User.findOne({ email });

// Cập nhật mật khẩu (HASHED) của user
export const updateUserPassword = async (email, hashedPassword) => {
    
     await User.findOneAndUpdate({ email }, { password_hash: hashedPassword });
};
// Tạo user mới
const createUser = (userData) => User.create(userData);

// Tìm theo _id (MongoDB mặc định sử dụng ObjectId)
const findById = async (userId) => {
    try {
        const objectId = new mongoose.Types.ObjectId(userId);
        const user = await User.findById(objectId).select("-password_hash"); // Không trả về password
        return user;
    } catch (error) {
        // console.error("🚨 Lỗi trong findById userRepository:", error);
        return null;
    }
};

// Xóa user theo ID
const deleteUser = (id) => User.findOneAndDelete({ id });

// 🔹 Tìm theo UUID
const findByUUID = async (uuid) => {
    console.log("🔍 Đang tìm user với id:", uuid);
    return await User.findOne({ id: uuid });
};
// ✅ Cập nhật hồ sơ người dùng
 const updateUser = (userId, updateData) => {
    console.log("Check data usser from updateuser repositoy", updateData)
    return User.findByIdAndUpdate(userId, updateData, { new: true });
};

// ✅ Lấy danh sách đặt phòng của người dùng
const findBookingsByUserId = (userId) => {
    return Booking.find({ userId: userId });
};

// ✅ Lấy phương thức thanh toán của người dùng
const getUserPaymentMethods = (userId) => {
    return PaymentMethod.find({ userId: userId });
};

export default { findByEmail,updateUserPassword, createUser, updateUser ,findById, deleteUser, findByUUID, updateUser,findBookingsByUserId,getUserPaymentMethods };

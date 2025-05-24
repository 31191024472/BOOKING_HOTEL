import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendMail } from "../config/mailer.js";
import userRepository from "../repositories/userRepository.js";

const register = async (userData) => {
  const existing = await userRepository.findByEmail(userData.email);
  if (existing) throw new Error("User already exists");

  // Hash password trước khi lưu vào database
  userData.password_hash = await bcrypt.hash(userData.password, 10);
  userData.fullName = `${userData.firstName} ${userData.lastName}`;

  return await userRepository.createUser(userData);
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error("Người dùng không tồn tại");
  if (!password || !user.password_hash) {
    throw new Error("Thiếu mật khẩu hoặc hash để kiểm tra!");
  }
  // So sánh mật khẩu với hash
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error("Mật khẩu không đúng!");
  // Tạo JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  const { password_hash, ...safeUser } = user.toObject();

  return { token, user: safeUser };
};

// Xác thực tài khoản bằng token
const getAuthUser = async (userId) => {
  try {
    const user = await userRepository.findById(userId);
    return user;
  } catch (error) {
    console.error("🚨 Lỗi trong getAuthUser:", error);
    throw new Error("Lỗi khi lấy thông tin người dùng");
  }
};

// ✅ Cập nhật hồ sơ người dùng
const updateUserProfile = async (userId, updateData) => {
  return await userRepository.updateUser(userId, updateData);
};

// ✅ Lấy danh sách đặt phòng của người dùng
const getUserBookings = async (userId) => {
  return await userRepository.findBookingsByUserId(userId);
};

// ✅ Lấy phương thức thanh toán của người dùng
const getUserPayments = async (userId) => {
  return await userRepository.getUserPaymentMethods(userId);
};

const forgotPassword = async (email) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Email không tồn tại.");
  }

  // Tạo mật khẩu mới ngẫu nhiên
  const newPassword = crypto.randomBytes(6).toString("hex");

  // Hash mật khẩu mới trước khi lưu vào database
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Gọi repository để cập nhật mật khẩu đã hash vào database
  await userRepository.updateUserPassword(email, hashedPassword);

  const subject = "Khôi phục mật khẩu";
  const text = `Mật khẩu mới của bạn là: ${newPassword}`;

  // Gửi email chứa mật khẩu mới cho người dùng
  await sendMail(email, subject, text);

  return "Mật khẩu mới đã được gửi đến email của bạn.";
};

export default {
  register,
  login,
  getUserPayments,
  getAuthUser,
  getUserBookings,
  updateUserProfile,
  forgotPassword,
};

import bcrypt from "bcryptjs";
import userRepository from "../repositories/adminUserRespository.js";

class UserService {
  async getAllUsers() {
    return await userRepository.getAllUsers();
  }

  async createUser(userData) {
    const { email, password } = userData;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("Email đã tồn tại!");
    }

    // Băm mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);
    return await userRepository.createUser({
      ...userData,
      password_hash: hashedPassword,
    });
  }

  async updateUser(id, updateData) {
    // Nếu có mật khẩu mới, băm trước khi cập nhật
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await userRepository.updateUser(id, updateData);
    if (!updatedUser) throw new Error("User không tồn tại");

    return updatedUser;
  }

  async deleteUser(id) {
    const deletedUser = await userRepository.deleteUser(id);
    if (!deletedUser) throw new Error("User không tồn tại");

    return { message: "Xóa user thành công!" };
  }
}

export default new UserService();

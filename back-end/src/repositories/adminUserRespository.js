import User from "../models/User.js";

class UserRepository {
  async getAllUsers() {
    return await User.find()
      .populate("countryId", "name")
      .select("-password_hash");
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async findUserById(id) {
    return await User.findById(id).populate("countryId", "name");
  }

  async createUser(userData) {
    const newUser = new User(userData);
    return await newUser.save();
  }

  async updateUser(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).populate(
      "countryId",
      "name"
    );
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }

  async getUsersByRole(role) {
    return await User.find({ role }, "email");
  }
}

export default new UserRepository();

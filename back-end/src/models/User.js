import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  phone: { type: String, required: false },
  role: { type: String, enum: ["user", "admin", "partner"], default: "user" },
  dateOfBirth: { type: Date, required: false, default: null },  // 🆕 Ngày sinh
  countryId: {                                             // ✅ Lưu ObjectId của Country
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: false
  },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema, "Users");

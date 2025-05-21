import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true }, // Ví dụ: DN, HN, HCM
  image: String                                         // Đường dẫn hoặc URL ảnh đại diện
}, { timestamps: true });

export default mongoose.model('City', citySchema);




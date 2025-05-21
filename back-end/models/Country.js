import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },   // Tên quốc gia (Vietnam, United States...)
  code: { type: String, required: true }   // Mã quốc gia (VN, US, UK...)
}, { timestamps: true });

export default mongoose.model('Country', countrySchema);

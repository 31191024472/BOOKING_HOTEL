import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String },
  partner_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  } ,
  discount_percentage: { type: Number, required: true },
  valid_from: { type: Date, required: true },
  valid_until: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Discount", discountSchema);

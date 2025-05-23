import cloudinary from "../config/cloudinary.js";

export const uploadImageToCloudinary = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "user_uploads", // Lưu vào thư mục trên Cloudinary
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("❌ Lỗi upload ảnh:", error);
    throw new Error("Không thể upload ảnh lên Cloudinary");
  }
};

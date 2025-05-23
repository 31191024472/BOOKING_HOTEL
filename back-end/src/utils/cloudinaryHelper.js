import cloudinary from "../config/cloudinary.js";

/**
 * Upload ảnh lên Cloudinary
 * @param {Buffer} fileBuffer - Buffer của file ảnh
 * @returns {Promise<string>} URL của ảnh sau khi upload
 */
export const uploadImageToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { 
        folder: "hotel_images",
        resource_type: "auto",
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
        transformation: [
          { width: 1000, height: 1000, crop: "limit" }, // Giới hạn kích thước
          { quality: "auto" }, // Tự động tối ưu chất lượng
          { fetch_format: "auto" } // Tự động chọn định dạng tốt nhất
        ]
      },
      (error, result) => {
        if (error) {
          console.error("❌ Lỗi upload ảnh:", error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

export default {uploadImageToCloudinary}
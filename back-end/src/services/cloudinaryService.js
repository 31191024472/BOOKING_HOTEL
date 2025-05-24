import cloudinary from '../config/cloudinary.js';

/**
 * Upload hình ảnh lên Cloudinary
 * @param {string} imagePath - Đường dẫn của ảnh (hoặc URL từ client)
 * @param {string} folder - Tên thư mục lưu trữ trên Cloudinary
 * @returns {Object} - Dữ liệu upload từ Cloudinary
 */
export const uploadImage = async (imagePath, folder = "uploads") => {
    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: folder, // Lưu vào thư mục cụ thể
            resource_type: "image",
            use_filename: true,
            unique_filename: false,
        });
        return result;
    } catch (error) {
        console.error("🚨 Lỗi upload ảnh:", error);
        throw new Error("Không thể upload ảnh lên Cloudinary");
    }
};

import { uploadImage } from '../services/cloudinaryService.js';

/**
 * Xử lý request upload ảnh
 */
export const uploadImageController = async (req, res) => {
    try {
        const file = req.file; // Multer sẽ gán file vào req.file
        if (!file) {
            return res.status(400).json({ success: false, message: "Không có file nào được tải lên!" });
        }

        const result = await uploadImage(file.path, "user_uploads");
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

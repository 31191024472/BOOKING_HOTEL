import express from "express";
import multer from "multer";
import { uploadImageToCloudinary } from "../utils/cloudinaryHelper.js";

const router = express.Router();

// Cấu hình multer để xử lý file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận file ảnh
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
  },
});

/**
 * @route POST /api/upload/images
 * @desc Upload nhiều ảnh lên Cloudinary
 * @access Private
 */
router.post('/upload/images', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn ít nhất một hình ảnh'
      });
    }

    // Upload từng ảnh lên Cloudinary
    const uploadPromises = req.files.map(file => 
      uploadImageToCloudinary(file.buffer)
    );

    const urls = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: 'Upload ảnh thành công',
      data: {
        urls: urls
      }
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể tải lên hình ảnh'
    });
  }
});

export default router;

import fs from "fs";
import path from "path";
import cloudinary from "../config/cloudinary.js";

const IMAGE_DIR = path.join(process.cwd(), "..", "images"); 

const uploadImages = async () => {
  try {
    const files = fs.readdirSync(IMAGE_DIR); // Đọc danh sách file ảnh
    console.log(`📂 Tìm thấy ${files.length} ảnh trong thư mục ${IMAGE_DIR}`);

    for (const file of files) {
      const filePath = path.join(IMAGE_DIR, file);

      if (!file.match(/\.(jpg|jpeg|png|gif)$/i)) {
        console.log(`⚠️ Bỏ qua: ${file} (Không phải ảnh)`);
        continue;
      }

      console.log(`⬆️ Uploading: ${file}...`);

      const result = await cloudinary.uploader.upload(filePath, {
        folder: "user_uploads",
      });

      console.log(`✅ Upload thành công: ${result.secure_url}`);
    }

    console.log("🎉 Tất cả ảnh đã được upload!");
  } catch (error) {
    console.error("❌ Lỗi khi upload ảnh:", error);
  }
};

// Chạy script upload ảnh
uploadImages();

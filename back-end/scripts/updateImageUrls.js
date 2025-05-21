import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import Hotel from "../models/Hotel.js";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Kết nối MongoDB thành công!");
    } catch (error) {
        console.error("❌ Lỗi kết nối MongoDB:", error);
        process.exit(1);
    }
};

const uploadImageToCloudinary = async (localPath) => {
    try {
        if (!fs.existsSync(localPath)) {
            throw new Error(`Ảnh không tồn tại: ${localPath}`);
        }

        const result = await cloudinary.uploader.upload(localPath, {
            folder: "hotel_images",
            use_filename: true,
        });

        console.log(`✅ Ảnh đã upload: ${result.secure_url}`);
        return result.secure_url;
    } catch (error) {
        console.error(`❌ Lỗi upload ảnh: ${error.message}`);
        return null;
    }
};

const updateHotelImages = async () => {
    await connectDB();

    try {
        const hotels = await Hotel.find();
        console.log(`📌 Tìm thấy ${hotels.length} khách sạn cần cập nhật ảnh`);

        for (const hotel of hotels) {
            let updated = false;

            for (let i = 0; i < hotel.images.length; i++) {
                const oldUrl = hotel.images[i].imageUrl;

                // ✅ Kiểm tra nếu đường dẫn chưa phải Cloudinary
                if (!oldUrl.includes("cloudinary.com")) {
                    console.log(`🔄 Đang upload lại ảnh: ${oldUrl}`);

                    // 🔥 Tạo đường dẫn đầy đủ
                    const localPath = path.resolve("public", oldUrl);
                    const newImageUrl = await uploadImageToCloudinary(localPath);

                    if (newImageUrl) {
                        hotel.images[i].imageUrl = newImageUrl;
                        updated = true;
                    }
                }
            }

            if (updated) {
                await hotel.save();
                console.log(`💾 Đã cập nhật ảnh cho khách sạn: ${hotel.title}`);
            }
        }

        console.log("🎉 Hoàn tất cập nhật tất cả ảnh!");
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật ảnh:", error);
    } finally {
        mongoose.connection.close();
        console.log("🔌 Đã đóng kết nối MongoDB.");
    }
};

// Chạy script cập nhật ảnh
updateHotelImages();

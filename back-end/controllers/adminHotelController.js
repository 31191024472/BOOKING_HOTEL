import mongoose from "mongoose";
import * as hotelService from "../services/adminHotelService.js";

export const getHotels = async (req, res) => {
  try {
    const hotels = await hotelService.getAllHotels();
    res.status(200).json({ success: true, hotels });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi lấy danh sách khách sạn", error });
  }
};

export const createHotel = async (req, res) => {
  try {
    console.log("Received body:", req.body);
    console.log("Received files:", req.files);
    console.log("typeof hotelCode:", typeof req.body.hotelCode);
    console.log("typeof cityId:", typeof req.body.cityId);

    // Chuyển hotelCode từ string sang Number
    req.body.hotelCode = Number(req.body.hotelCode);

    // Chuyển cityId từ string sang ObjectId
    if (mongoose.Types.ObjectId.isValid(req.body.cityId)) {
      req.body.cityId = new mongoose.Types.ObjectId(req.body.cityId);
    } else {
      throw new Error("cityId không hợp lệ");
    }

    // Xử lý benefits nếu là chuỗi JSON
    if (typeof req.body.benefits === "string") {
      try {
        req.body.benefits = JSON.parse(req.body.benefits);
      } catch (err) {
        req.body.benefits = req.body.benefits.split(",").map((b) => b.trim());
      }
    }

    // Gửi dữ liệu đã xử lý cho service để lưu vào database
    const newHotel = await hotelService.createHotel(req.body, req.files);
    res.status(201).json({
      success: true,
      message: "Khách sạn đã được tạo",
      hotel: newHotel,
    });
  } catch (error) {
    console.error("Lỗi tạo khách sạn:", error); // Debug lỗi chi tiết
    res
      .status(500)
      .json({ success: false, message: "Lỗi tạo khách sạn", error });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const updatedHotel = await hotelService.updateHotel(
      req.params.id,
      req.body,
      req.files
    );
    if (!updatedHotel) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy khách sạn" });
    }
    res.status(200).json({
      success: true,
      message: "Khách sạn đã được cập nhật",
      hotel: updatedHotel,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi cập nhật khách sạn", error });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const deletedHotel = await hotelService.deleteHotel(req.params.id);
    if (!deletedHotel) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy khách sạn" });
    }
    res.status(200).json({ success: true, message: "Khách sạn đã được xóa" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi xóa khách sạn", error });
  }
};

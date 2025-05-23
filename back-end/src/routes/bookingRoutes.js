import express from "express";
import { getUserBookings, createBooking } from "../controllers/bookingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Tạo đặt phòng mới
router.post("/", authMiddleware, createBooking);

// Lấy danh sách đặt phòng của user
router.get("/user", authMiddleware, getUserBookings);

export default router;

import express from "express";
import { getRevenueStatistics } from "../controllers/adminRevenueController.js";

const router = express.Router();

// API Lấy thống kê doanh thu đặt phòng
router.get("/", getRevenueStatistics);

export default router;

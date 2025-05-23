import express from "express";
import { getPayments, addPayment } from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getPayments);
router.post("/", authMiddleware, addPayment);

export default router;

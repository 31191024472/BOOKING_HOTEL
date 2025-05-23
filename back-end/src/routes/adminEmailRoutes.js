import express from "express";
import { sendPromotionalEmail } from "../controllers/adminEmailController.js";
import { emailUploadMiddleware } from "../services/adminEmailService.js";

const router = express.Router();

router.post("/send", emailUploadMiddleware, sendPromotionalEmail);

export default router;

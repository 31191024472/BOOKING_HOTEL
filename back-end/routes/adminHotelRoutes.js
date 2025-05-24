import express from "express";
import {
  createHotel,
  deleteHotel,
  getHotels,
  updateHotel,
} from "../controllers/adminHotelController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getHotels);
router.post("/", upload.array("images", 5), createHotel);
router.put("/:id", upload.array("images", 5), updateHotel);
router.delete("/:id", deleteHotel);

export default router;

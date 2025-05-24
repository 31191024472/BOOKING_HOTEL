import express from "express";
import {
  createCountry,
  deleteCountry,
  getCountries,
  getCountryById,
  updateCountry,
} from "../controllers/adminCountryController.js";

const router = express.Router();

router.get("/", getCountries);
router.get("/:id", getCountryById);
router.post("/", createCountry);
router.put("/:id", updateCountry);
router.delete("/:id", deleteCountry);

export default router;

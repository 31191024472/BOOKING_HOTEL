import cors from "cors";
import express from "express";
import bookingRoutes from "./routes/bookingRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import miscRoutes from "./routes/miscRoutes.js";
import paymentRoutes from "./routes/paymentRouter.js";
import roomRoutes from "./routes/roomRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminBookingRoutes from "./routes/adminBookingRoutes.js";
import adminCityRoutes from "./routes/adminCityRoutes.js";
import adminCountryRoutes from "./routes/adminCountryRoutes.js";
import adminEmailRoutes from "./routes/adminEmailRoutes.js";
import adminHotelRoutes from "./routes/adminHotelRoutes.js";
import adminRevenueRoutes from "./routes/adminRevenueRoutes.js";
import adminRoomRoutes from "./routes/adminRoomRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
// Config ExpressExpress
const app = express();
app.use(express.json());

// Config Cros
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Test API
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Admin routes
app.use("/api/admin/revenue", adminRevenueRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);
app.use("/api/admin/rooms", adminRoomRoutes);
app.use("/api/admin/hotels", adminHotelRoutes);
app.use("/api/admin/countries", adminCountryRoutes);
app.use("/api/admin/email", adminEmailRoutes);
app.use("/api/admin/cities", adminCityRoutes);
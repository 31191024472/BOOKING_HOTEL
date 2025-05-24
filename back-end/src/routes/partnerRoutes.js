import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import partnerMiddleware from '../middlewares/partnerMiddleware.js';
import {
  // Quản lý khách sạn
  getHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelDetails,
  getCities,
  
  // Quản lý đặt phòng
  getBookingsByHotel,


  // Quản lý phòng
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomDetails,
  
  // Quản lý khuyến mãi
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscountDetails,
  
  // Quản lý tài khoản
  getProfile,
  updateProfile,
  changePassword,
  
  // Thống kê và báo cáo
  getDashboardStats,
  getBookingReports,
  getRevenueReports,
  getOccupancyReports,
  updateBookingStatus
} from '../controllers/partnerController.js';

const router = express.Router();

// Áp dụng middleware xác thực và kiểm tra quyền partner
router.use(authMiddleware, partnerMiddleware);

// Quản lý khách sạn
router.get('/hotels', getHotels);
router.post('/hotels', createHotel);
router.put('/hotels/:hotelId', updateHotel);
router.delete('/hotels/:hotelId', deleteHotel);
router.get('/hotels/:hotelId', getHotelDetails);
router.get('/cities', getCities)

//Quản lý đặt phòng
router.get('/hotels/:hotelId/bookings', getBookingsByHotel)

// Quản lý phòng
router.get('/hotels/:hotelId/rooms', getRooms);
router.post('/hotels/:hotelId/rooms', createRoom);
router.put('/rooms/:roomId', updateRoom);
router.delete('/rooms/:roomId', deleteRoom);
router.get('/rooms/:roomId', getRoomDetails);

// Quản lý khuyến mãi
router.get('/discounts', getDiscounts);
router.post('/discounts', createDiscount);
router.put('/discounts/:discountId', updateDiscount);
router.delete('/discounts/:discountId', deleteDiscount);
router.get('/discounts/:discountId', getDiscountDetails);


// Quản lý tài khoản
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

// Thống kê và báo cáo
router.get('/dashboard', getDashboardStats);
router.get('/reports/bookings', getBookingReports);
router.get('/reports/revenue', getRevenueReports);
router.get('/reports/occupancy', getOccupancyReports);

// Cập nhật trạng thái đặt phòng
router.put('/bookings/:bookingId/status', updateBookingStatus);

export default router;  
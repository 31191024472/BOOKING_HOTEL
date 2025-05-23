import express from 'express';
import {
  getHotels,
  getHotelByCode,
  createHotel,
  updateHotel,
  deleteHotel,
  getNearbyHotels,
  getAvailableCities,
  getHotelFilters,
  getPopularDestinations,
  getHotelReview,
  getHotelBookingDetails,
  addHotelReview
} from '../controllers/HotelController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

// ✅ Các API tĩnh hoặc không cần hotelCode
router.get('/nearbyHotels', getNearbyHotels);
router.get('/availableCities', getAvailableCities);
router.get('/popularDestinations', getPopularDestinations);
router.get('/verticalFilters', getHotelFilters);
router.get('/', getHotels);

// ✅ Các API dynamic liên quan đến hotelCode (chi tiết, review)
router.get('/:hotelCode/reviews', getHotelReview);
router.post('/:hotelCode/reviews', authMiddleware, addHotelReview);
router.get('/:hotelCode/booking/enquiry', getHotelBookingDetails);
router.get('/:hotelCode', getHotelByCode);

// ✅ CRUD Hotel
router.post('/', createHotel);
router.put('/:hotelCode', updateHotel);
router.delete('/:hotelCode', deleteHotel);

export default router;

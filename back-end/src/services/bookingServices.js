import bookingRepository from "../repositories/bookingRepository.js";
import Booking from "../models/Booking.js";

class BookingService {
  async createBooking(bookingData) {
    try {
      const booking = await bookingRepository.createBooking(bookingData);
      return booking;
    } catch (error) {
      console.error('Create booking service error:', error);
      throw new Error('Không thể tạo đặt phòng: ' + error.message);
    }
  }
  // Lấy danh sách đặt phòng của khách sạn
  async getBookingsByHotel(hotelId) {
    if (!hotelId) {
      throw new Error('Thiếu hotelId', 400);
    }
    const bookings = await bookingRepository.findByHotelId(hotelId);
  
    return bookings;

  }
  // Cập nhật trạng thái đặt phòng
  async updateBookingStatus(bookingId, status) {
    try {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { 
          status,
          updatedAt: new Date()
        },
        { new: true }
      );
      
      if (!booking) {
        throw new Error('Không tìm thấy đặt phòng');
      }

      return booking;
    } catch (error) {
      throw new Error('Không thể cập nhật trạng thái đặt phòng: ' + error.message);
    }
  }
}

export default new BookingService();
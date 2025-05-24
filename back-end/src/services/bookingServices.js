import bookingRepository from "../repositories/bookingRepository.js";

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
}

export default new BookingService();
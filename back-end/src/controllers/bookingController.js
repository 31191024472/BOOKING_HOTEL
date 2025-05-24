import bookingService from "../services/bookingServices.js";
import PaymentMethod from "../models/PaymentMethod.js";

export const createBooking = async (req, res) => {
  try {
    // Lưu phương thức thanh toán
    const paymentMethod = await PaymentMethod.create({
      userId: req.user._id,
      cardType: req.body.paymentDetails.cardType,
      cardNumber: req.body.paymentDetails.cardNumber,
      expiryDate: req.body.paymentDetails.expiryDate,
      nameOnCard: req.body.paymentDetails.nameOnCard,
      billingAddress: req.body.billingAddress,
      isDefault: true
    });
    function convertDate(dateString) {
      const parts = dateString.split('-'); // Tách theo dấu "-"
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); // Đổi thành "yyyy-MM-dd"
    }
   // Kiểm tra và chuyển đổi ngày tháng
   const checkInDate = convertDate(req.body.checkIn);
   const checkOutDate = convertDate(req.body.checkOut);

   // Kiểm tra tính hợp lệ của ngày
   if (isNaN(checkInDate) || isNaN(checkOutDate)) {
     return res.status(400).json({ success: false, message: "Ngày không hợp lệ" });
   }    
    // Tạo booking mới
    const booking = await bookingService.createBooking({
      userId: req.user._id,
      hotelId: req.body.hotelId,
      checkIn: checkInDate,  // Đảm bảo ngày đúng định dạng
      checkOut: checkOutDate, // Đảm bảo ngày đúng định dạng
      guests: req.body.guests,
      rooms: req.body.rooms || 1,  // Mặc định là 1 nếu không có giá trị
      roomId: req.body.roomId, 
      totalPrice: req.body.totalPrice,
      paymentMethodId: paymentMethod._id,
    });
    
    res.json({ 
      success: true, 
      data: {
        bookingId: booking._id
      }
    });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(400).json({ 
      success: false, 
      message: err.message || 'Có lỗi xảy ra khi tạo đặt phòng'
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user._id);
    
    const formattedBookings = bookings.map(booking => ({
      bookingId: booking._id,
      hotelId: booking.hotelId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      rooms: booking.rooms,
      roomType: booking.roomType,
      totalPrice: booking.totalPrice,
      status: booking.status,
      createdAt: booking.createdAt,
      paymentMethod: {
        cardType: booking.paymentMethodId.cardType,
        cardNumber: booking.paymentMethodId.cardNumber,
        expiryDate: booking.paymentMethodId.expiryDate,
        nameOnCard: booking.paymentMethodId.nameOnCard
      }
    }));

    res.json({ 
      success: true, 
      data: {
        elements: formattedBookings
      }
    });
  } catch (err) {
    console.error('Get user bookings error:', err);
    res.status(400).json({ 
      success: false, 
      message: err.message || 'Có lỗi xảy ra khi lấy danh sách đặt phòng'
    });
  }
}; 


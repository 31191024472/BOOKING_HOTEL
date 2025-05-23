import * as BookingService from "../services/adminBookingService.js";

import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

export const getAllBookings = async (req, res) => {
  try {
    // Populate user, paymentMethod, room
    const bookings = await Booking.find().populate(
      "paymentMethodId userId roomId"
    );

    // Lấy danh sách tất cả khách sạn
    const hotels = await Hotel.find({}, "hotelCode title");
    const hotelMap = {};
    hotels.forEach((h) => (hotelMap[h.hotelCode] = h.title));

    // Gắn hotelTitle + roomType vào booking
    const bookingsWithDetails = bookings.map((booking) => ({
      ...booking._doc,
      hotelTitle: hotelMap[booking.hotelId] || "N/A",
      roomType: booking.roomId?.roomType || "N/A",
    }));

    res.json({ success: true, bookings: bookingsWithDetails });
  } catch (error) {
    console.error("Lỗi getAllBookings:", error);
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await BookingService.getBookingDetails(req.params.id);
    res.json({ success: true, booking });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

import * as BookingRepo from "../repositories/adminBookingRespository.js";

export const createBooking = async (data) => {
  const {
    userId,
    hotelId,
    roomId,
    checkIn,
    checkOut,
    guests,
    rooms,
    totalPrice,
    paymentMethodId,
  } = data;

  // Kiểm tra khách sạn tồn tại
  const hotel = await BookingRepo.findHotelById(hotelId);
  if (!hotel) throw new Error("Khách sạn không tồn tại");

  // Tìm phòng bằng roomId
  const room = await BookingRepo.findRoomById(roomId);
  if (!room) throw new Error("Phòng không tồn tại");

  // Kiểm tra số lượng phòng còn trống
  if (room.availableRooms < rooms)
    throw new Error("Không đủ số lượng phòng trống");

  // Tạo booking
  const booking = await BookingRepo.createBooking({
    userId,
    hotelId,
    roomId,
    checkIn,
    checkOut,
    guests,
    rooms,
    totalPrice,
    paymentMethodId,
  });

  // Giảm số lượng phòng trống
  room.availableRooms -= rooms;
  await BookingRepo.updateRoomAvailability(room);

  return booking;
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await BookingService.updateBooking(req.params.id, req.body);
    res.json({
      success: true,
      message: "Cập nhật booking thành công",
      booking,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const result = await BookingService.deleteBooking(req.params.id);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

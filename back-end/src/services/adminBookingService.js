import * as BookingRepo from "../repositories/adminBookingRespository.js";

export const getAllBookings = async () => {
  return await BookingRepo.findAllBookings();
};

export const getBookingDetails = async (id) => {
  const booking = await BookingRepo.findBookingById(id);
  if (!booking) throw new Error("Không tìm thấy booking");
  return booking;
};

export const createNewBooking = async (data) => {
  const {
    userId,
    hotelId,
    checkIn,
    checkOut,
    guests,
    rooms,
    roomType,
    totalPrice,
    paymentMethodId,
  } = data;

  const hotel = await BookingRepo.findHotelById(hotelId);
  if (!hotel) throw new Error("Khách sạn không tồn tại");

  const room = await BookingRepo.findRoomByTypeAndHotel(hotelId, roomType);
  if (!room || room.availableRooms < rooms)
    throw new Error("Loại phòng không khả dụng hoặc không đủ số lượng");

  const booking = await BookingRepo.createBooking({
    userId,
    hotelId,
    checkIn,
    checkOut,
    guests,
    rooms,
    roomType,
    totalPrice,
    paymentMethodId,
  });

  room.availableRooms -= rooms;
  await BookingRepo.updateRoomAvailability(room);

  return booking;
};

export const updateBooking = async (id, data) => {
  const booking = await BookingRepo.updateBookingById(id, data);
  if (!booking) throw new Error("Booking không tồn tại");
  return booking;
};

export const deleteBooking = async (id) => {
  const booking = await BookingRepo.findBookingRawById(id);
  if (!booking) throw new Error("Không tìm thấy booking");

  // Hoàn lại phòng trước khi xoá booking
  const room = await BookingRepo.findRoomByTypeAndHotel(
    booking.hotelId,
    booking.roomType
  );
  if (room) {
    room.availableRooms += booking.rooms;
    await BookingRepo.updateRoomAvailability(room);
  }

  await BookingRepo.deleteBookingById(id);
  return { message: "Booking đã được xoá", deletedBookingId: id };
};

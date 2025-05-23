import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const findAllBookings = () =>
  Booking.find().populate("userId paymentMethodId hotelId");

export const findBookingById = (id) =>
  Booking.findById(id).populate("userId paymentMethodId hotelId");

export const createBooking = (bookingData) => new Booking(bookingData).save();

export const updateBookingById = (id, updateData) =>
  Booking.findByIdAndUpdate(id, updateData, { new: true });

export const findRoomByTypeAndHotel = (hotelId, roomType) =>
  Room.findOne({ hotelId, roomType });

export const findHotelById = (hotelId) => Hotel.findById(hotelId);

export const findBookingRawById = (id) => Booking.findById(id);

export const updateRoomAvailability = (room) => room.save();

export const deleteBookingById = (id) => Booking.findByIdAndDelete(id);
export const findRoomById = (roomId) => {
  return Room.findById(roomId);
};

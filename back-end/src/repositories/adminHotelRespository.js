import Hotel from "../models/Hotel.js";

export const getAllHotels = () => Hotel.find().populate("cityId");

export const getHotelById = (id) => Hotel.findById(id).populate("cityId");

export const createHotel = (data) => new Hotel(data).save();

export const updateHotel = (id, updateData) =>
  Hotel.findByIdAndUpdate(id, updateData, { new: true });

export const deleteHotel = (id) => Hotel.findByIdAndDelete(id);

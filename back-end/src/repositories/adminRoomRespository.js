import Room from "../models/Room.js";

const getAllRooms = () => Room.find();

const getRoomById = (id) => Room.findById(id);

const createRoom = (roomData) => new Room(roomData).save();

const updateRoom = (id, updateData) =>
  Room.findByIdAndUpdate(id, updateData, { new: true });

const deleteRoom = (id) => Room.findByIdAndDelete(id);

export default {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};

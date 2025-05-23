import Hotel from "../models/Hotel.js";
import roomRepository from "../repositories/adminRoomRespository.js";
import uploadImageToCloudinary  from "../utils/cloudinaryHelper.js";

const getRooms = async () => {
  const rooms = await roomRepository.getAllRooms();
  const hotels = await Hotel.find({}, "hotelCode title");

  return rooms.map((room) => {
    const hotel = hotels.find((h) => h.hotelCode === room.hotelCode);
    return {
      ...room._doc,
      hotelName: hotel ? hotel.title : "Không tìm thấy khách sạn",
    };
  });
};

const getRoom = async (id) => {
  const room = await roomRepository.getRoomById(id);
  if (!room) return null;

  const hotel = await Hotel.findOne({ hotelCode: room.hotelCode });
  return {
    ...room._doc,
    hotelName: hotel ? hotel.title : "Không tìm thấy khách sạn",
  };
};

const createRoom = async (roomData, files) => {
  // Xử lý các hình ảnh upload lên Cloudinary
  const imageUrls = files?.length
    ? await Promise.all(
        files.map((file) => uploadImageToCloudinary(file.buffer))
      )
    : [];

  roomData.imageUrls = imageUrls;

  // Kiểm tra và chia amenities thành mảng nếu là string
  if (typeof roomData.amenities === "string") {
    roomData.amenities = roomData.amenities.split(",").map((a) => a.trim());
  }

  const newRoom = await roomRepository.createRoom({ ...roomData });
  return newRoom;
};

const updateRoom = async (id, updateData, files) => {
  if (files?.length > 0) {
    // Nếu có file hình ảnh, upload và gán vào trường imageUrls
    updateData.imageUrls = await Promise.all(
      files.map((file) => uploadImageToCloudinary(file.buffer))
    );
  }

  // Kiểm tra và chia amenities thành mảng nếu là string
  if (typeof updateData.amenities === "string") {
    updateData.amenities = updateData.amenities.split(",").map((a) => a.trim());
  }

  const updatedRoom = await roomRepository.updateRoom(id, updateData);
  if (!updatedRoom) throw new Error("Room not found");
  return updatedRoom;
};

const deleteRoom = async (id) => {
  const deletedRoom = await roomRepository.deleteRoom(id);
  if (!deletedRoom) throw new Error("Room not found");
  return deletedRoom;
};

export default {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
};

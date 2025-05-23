import roomService from "../services/adminRoomService.js";

export const getRooms = async (req, res) => {
  try {
    const rooms = await roomService.getRooms();
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await roomService.getRoom(req.params.id);
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const room = await roomService.createRoom(req.body, req.files);
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await roomService.updateRoom(
      req.params.id,
      req.body,
      req.files
    );
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    await roomService.deleteRoom(req.params.id);
    res.json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

import RoomService from '../services/RoomService.js';

class RoomController {
  async getRoomsByHotelId(req, res) {
    try {
      const { hotelId } = req.params;
      const result = await RoomService.getRoomsByHotelId(hotelId);
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: ['Internal server error']
      });
    }
  }

  async getRoomById(req, res) {
    try {
      const { id } = req.params;
      const result = await RoomService.getRoomById(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: ['Internal server error']
      });
    }
  }

  async createRoom(req, res) {
    try {
      const roomData = req.body;
      const result = await RoomService.createRoom(roomData);
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: ['Internal server error']
      });
    }
  }

  async updateRoom(req, res) {
    try {
      const { id } = req.params;
      const roomData = req.body;
      const result = await RoomService.updateRoom(id, roomData);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: ['Internal server error']
      });
    }
  }

  async deleteRoom(req, res) {
    try {
      const { id } = req.params;
      const result = await RoomService.deleteRoom(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: ['Internal server error']
      });
    }
  }

  async checkRoomAvailability(req, res) {
    try {
      const { roomId } = req.params;
      const { checkIn, checkOut } = req.query;
      
      if (!checkIn || !checkOut) {
        return res.status(400).json({
          success: false,
          errors: ['Check-in and check-out dates are required']
        });
      }

      const result = await RoomService.checkRoomAvailability(roomId, checkIn, checkOut);
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        errors: ['Internal server error']
      });
    }
  }
}

export default new RoomController(); 
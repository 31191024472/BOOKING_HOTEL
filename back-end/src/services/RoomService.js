import RoomRepository from '../repositories/RoomRepository.js';

class RoomService {
  async getRoomsByHotelId(hotelId) {
    try {
      const rooms = await RoomRepository.findByHotelId(hotelId);
      // Chỉ trả về các phòng còn trống và đang active
      const availableRooms = rooms.filter(room => 
        room.isActive && room.availableRooms > 0
      );
      
      return {
        success: true,
        data: availableRooms
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  async getRoomById(id) {
    try {
      const room = await RoomRepository.findById(id);
      if (!room) {
        return {
          success: false,
          errors: ['Room not found']
        };
      }
      
      if (!room.isActive) {
        return {
          success: false,
          errors: ['Room is not available']
        };
      }

      return {
        success: true,
        data: room
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  async createRoom(roomData) {
    try {
      // Đảm bảo availableRooms bằng totalRooms khi tạo mới
      roomData.availableRooms = roomData.totalRooms;
      const room = await RoomRepository.create(roomData);
      return {
        success: true,
        data: room
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  async updateRoom(id, roomData) {
    try {
      const room = await RoomRepository.findById(id);
      if (!room) {
        return {
          success: false,
          errors: ['Room not found']
        };
      }

      // Không cho phép cập nhật availableRooms trực tiếp
      delete roomData.availableRooms;
      
      const updatedRoom = await RoomRepository.update(id, roomData);
      return {
        success: true,
        data: updatedRoom
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  async deleteRoom(id) {
    try {
      const room = await RoomRepository.findById(id);
      if (!room) {
        return {
          success: false,
          errors: ['Room not found']
        };
      }

      // Thay vì xóa, chỉ set isActive = false
      const updatedRoom = await RoomRepository.update(id, { isActive: false });
      return {
        success: true,
        data: updatedRoom
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  async checkRoomAvailability(roomId, checkIn, checkOut) {
    try {
      const room = await RoomRepository.findById(roomId);
      if (!room) {
        return {
          success: false,
          errors: ['Room not found']
        };
      }

      if (!room.isActive || room.availableRooms <= 0) {
        return {
          success: true,
          data: { isAvailable: false }
        };
      }

      // TODO: Implement availability check logic with bookings
      return {
        success: true,
        data: { isAvailable: true }
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  // Thêm phương thức mới để cập nhật số phòng trống
  async updateAvailableRooms(roomId, change) {
    try {
      const room = await RoomRepository.findById(roomId);
      if (!room) {
        return {
          success: false,
          errors: ['Room not found']
        };
      }

      const newAvailable = room.availableRooms + change;
      if (newAvailable < 0 || newAvailable > room.totalRooms) {
        return {
          success: false,
          errors: ['Invalid room availability']
        };
      }

      const updatedRoom = await RoomRepository.update(roomId, {
        availableRooms: newAvailable
      });

      return {
        success: true,
        data: updatedRoom
      };
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }
}

export default new RoomService(); 
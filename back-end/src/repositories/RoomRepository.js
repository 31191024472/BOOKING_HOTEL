import Room from '../models/Room.js';
import mongoose from 'mongoose';

class RoomRepository {
  // async findByHotelId(hotelId) {
  //   try {
  //     const rooms = await Room.find({hotelId : hotelId})
  //     return rooms;
  //   } catch (error) {
  //     throw new Error(`Error finding rooms by hotel ID: ${error.message}`);
  //   }
  // }
  async findByHotelId(hotelId) {
    try {
      const objectId = new mongoose.Types.ObjectId(hotelId);
      const rooms = await Room.find({ hotelId: objectId });
      return rooms;
    } catch (error) {
      throw new Error(`Error finding rooms by hotel ID: ${error.message}`);
    }
  };
  async findById(id) {
    try {
      return await Room.findById(id);
    } catch (error) {
      throw new Error(`Error finding room by ID: ${error.message}`);
    }
  }

  async create(roomData) {
    try {
      console.log('🚀 Repository: Bắt đầu tạo phòng:', roomData);
  
      const room = new Room(roomData);
      const savedRoom = await room.save();
  
      console.log('✅ Repository: Tạo phòng thành công:', {
        roomId: savedRoom._id,
        hotelId: savedRoom.hotelId
      });
  
      return savedRoom;
  
    } catch (error) {
      console.error('❌ Repository: Lỗi trong create:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
  
      if (error.name === 'ValidationError') {
        throw new AppError(error.message, 400);
      }
  
      throw new AppError('Lỗi khi tạo phòng mới', 500);
    }
  }

  async update(roomId, updateData) {
    try {
      console.log('🚀 Repository: Bắt đầu cập nhật phòng:', {
        roomId,
        updateData
      });
  
      const updatedRoom = await Room.findByIdAndUpdate(
        roomId,
        { $set: updateData },
        { 
          new: true,
          runValidators: true
        }
      );
  
      if (!updatedRoom) {
        console.error('❌ Không tìm thấy phòng để cập nhật');
        throw new AppError('Không tìm thấy phòng', 404);
      }
  
      console.log('✅ Repository: Cập nhật phòng thành công:', {
        roomId: updatedRoom._id,
        hotelId: updatedRoom.hotelId
      });
  
      return updatedRoom;
  
    } catch (error) {
      console.error('❌ Repository: Lỗi trong update:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
  
      if (error.name === 'ValidationError') {
        throw new AppError(error.message, 400);
      }
  
      throw new AppError('Lỗi khi cập nhật phòng', 500);
    }
  }

  async delete(roomId) {
    try {
      console.log('Repository: Bắt đầu xóa phòng:', roomId);

      const deletedRoom = await Room.findByIdAndDelete(roomId);
      
      if (!deletedRoom) {
        console.error('❌ Repository: Không tìm thấy phòng để xóa');
        return null;
      }

      console.log('✅ Repository: Xóa phòng thành công:', {
        id: deletedRoom._id,
        hotelId: deletedRoom.hotelId
      });

      return deletedRoom;
    } catch (error) {
      console.error('❌ Repository: Lỗi trong delete:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
  async deleteByHotelId(hotelId) {
    return await Room.deleteMany({ hotelId: new mongoose.Types.ObjectId(hotelId) });
  };

  async checkAvailability(roomId, checkIn, checkOut) {
    try {
      // TODO: Implement availability check logic with bookings
      return true;
    } catch (error) {
      throw new Error(`Error checking room availability: ${error.message}`);
    }
  }

  async findByHotelIds(hotelIds) {
    try {
      return await Room.find({
        hotelId: { $in: hotelIds }
      });
    } catch (error) {
      console.error('🚨 Error in findByHotelIds:', error);
      throw error;
    }
  }
}

export default new  RoomRepository(); 
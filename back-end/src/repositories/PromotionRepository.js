import Promotion from '../models/Promotion.js';
import mongoose from 'mongoose';

class PromotionRepository {
  async create(promotionData) {
    try {
      console.log('Repository: Bắt đầu tạo khuyến mãi:', promotionData);

      const promotion = new Promotion(promotionData);
      const savedPromotion = await promotion.save();

      console.log('✅ Repository: Tạo khuyến mãi thành công:', {
        id: savedPromotion._id,
        roomId: savedPromotion.roomId
      });

      return savedPromotion;
    } catch (error) {
      console.error('❌ Repository: Lỗi trong create:', error);
      throw error;
    }
  }

  async findByRoomId(roomId) {
    try {
      return await Promotion.find({
        roomId: new mongoose.Types.ObjectId(roomId),
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      });
    } catch (error) {
      console.error('❌ Repository: Lỗi trong findByRoomId:', error);
      throw error;
    }
  }

  async findByHotelId(hotelId) {
    try {
      return await Promotion.find({
        hotelId: new mongoose.Types.ObjectId(hotelId),
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      });
    } catch (error) {
      console.error('❌ Repository: Lỗi trong findByHotelId:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Promotion.findById(id);
    } catch (error) {
      console.error('❌ Repository: Lỗi trong findById:', error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const updatedPromotion = await Promotion.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      return updatedPromotion;
    } catch (error) {
      console.error('❌ Repository: Lỗi trong update:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      return await Promotion.findByIdAndDelete(id);
    } catch (error) {
      console.error('❌ Repository: Lỗi trong delete:', error);
      throw error;
    }
  }
}

export default new PromotionRepository(); 
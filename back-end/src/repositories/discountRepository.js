import Discount from '../models/Discount.js';
import { AppError } from '../utils/errorHandler.js';

class DiscountRepository {
  // Tìm khuyến mãi theo partnerId
  async findByPartnerId(partnerId) {
    try {
      return await Discount.find({ partnerId })
        .populate('hotelId', 'name')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error in findByPartnerId:', error);
      throw new AppError('Lỗi khi tìm khuyến mãi theo partner', 500);
    }
  }

  // Tìm khuyến mãi theo ID
  async findById(id) {
    try {
      return await Discount.findById(id)
        .populate('hotelId', 'name');
    } catch (error) {
      console.error('Error in findById:', error);
      throw new AppError('Lỗi khi tìm khuyến mãi', 500);
    }
  }

  // Tìm khuyến mãi theo mã code
  async findByCode(code) {
    try {
      return await Discount.findOne({ code })
        .populate('hotelId', 'name');
    } catch (error) {
      console.error('Error in findByCode:', error);
      throw new AppError('Lỗi khi tìm khuyến mãi theo mã', 500);
    }
  }

  // Tạo khuyến mãi mới
  async create(discountData) {
    try {
      const discount = new Discount(discountData);
      return await discount.save();
    } catch (error) {
      console.error('Error in create:', error);
      throw new AppError('Lỗi khi tạo khuyến mãi mới', 500);
    }
  }

  // Cập nhật khuyến mãi
  async update(id, updateData) {
    try {
      return await Discount.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      );
    } catch (error) {
      console.error('Error in update:', error);
      throw new AppError('Lỗi khi cập nhật khuyến mãi', 500);
    }
  }

  // Xóa khuyến mãi
  async delete(id) {
    try {
      return await Discount.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error in delete:', error);
      throw new AppError('Lỗi khi xóa khuyến mãi', 500);
    }
  }

  // Kiểm tra khuyến mãi còn hiệu lực
  async checkValidDiscount(code, hotelId) {
    try {
      const now = new Date();
      return await Discount.findOne({
        code,
        hotelId,
        status: 'active',
        validFrom: { $lte: now },
        validUntil: { $gte: now }
      });
    } catch (error) {
      console.error('Error in checkValidDiscount:', error);
      throw new AppError('Lỗi khi kiểm tra khuyến mãi', 500);
    }
  }

  // Lấy danh sách khuyến mãi đang hoạt động của khách sạn
  async getActiveDiscounts(hotelId) {
    try {
      const now = new Date();
      return await Discount.find({
        hotelId,
        status: 'active',
        validFrom: { $lte: now },
        validUntil: { $gte: now }
      }).sort({ validUntil: 1 });
    } catch (error) {
      console.error('Error in getActiveDiscounts:', error);
      throw new AppError('Lỗi khi lấy danh sách khuyến mãi đang hoạt động', 500);
    }
  }

  // Cập nhật trạng thái khuyến mãi
  async updateStatus(id, status) {
    try {
      return await Discount.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );
    } catch (error) {
      console.error('Error in updateStatus:', error);
      throw new AppError('Lỗi khi cập nhật trạng thái khuyến mãi', 500);
    }
  }

  // Lấy thống kê khuyến mãi
  async getDiscountStats(partnerId, startDate, endDate) {
    try {
      const query = {
        partnerId,
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };

      const [total, active, expired, used] = await Promise.all([
        Discount.countDocuments(query),
        Discount.countDocuments({ ...query, status: 'active' }),
        Discount.countDocuments({ ...query, status: 'expired' }),
        Discount.countDocuments({ ...query, status: 'used' })
      ]);

      return {
        total,
        byStatus: {
          active,
          expired,
          used
        }
      };
    } catch (error) {
      console.error('Error in getDiscountStats:', error);
      throw new AppError('Lỗi khi lấy thống kê khuyến mãi', 500);
    }
  }
}

export default new DiscountRepository(); 
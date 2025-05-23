import Hotel from '../models/Hotel.js';
import City from '../models/City.js';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import mongoose from "mongoose";
import { AppError } from '../utils/errorHandler.js';

class HotelRepository {
  async findAllHotels() {
    return await Hotel.find();
  }

  async findHotelByCode(hotelCode) {
    return await Hotel.findOne({ hotelCode });
  }

  async createHotel(hotelData) {
    try {
      const hotel = new Hotel(hotelData);
      return await hotel.save();
    } catch (error) {
      throw new AppError('Lỗi khi tạo khách sạn mới', 500);
    }
  }

  async findLastHotel() {
    return await Hotel.findOne().sort({ hotelCode: -1 });
  };


  async updateHotel(id, updateData) {
    try {
      return await Hotel.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new AppError('Lỗi khi cập nhật khách sạn', 500);
    }
  }



  async deleteHotel(id) {
    try {
      const result = await Hotel.findByIdAndDelete(id);
      return result;
    } catch (error) {
      console.error('❌ Repository: Lỗi khi xóa khách sạn:', error);
      throw new AppError('Lỗi khi xóa khách sạn', 500);
    }
  }

  async findHotelsByCity(cityId) {
    try {
      const objectId = new mongoose.Types.ObjectId(cityId); 
      return await Hotel.find({ cityId: objectId });
    } catch (error) {
      console.error("Lỗi khi lấy khách sạn theo cityId:", error);
      throw error;
    }
  }

  async getAvailableCities() {
    try {
      return await City.find();
    } catch (error) {
      console.error('Error in getAvailableCities:', error);
      throw error;
    }
  }

  async fetchPopularDestinations() {
    const destinations = await City.find().limit(5);
    return destinations;
  }

  async getDistinctRatings() {
    return await Hotel.distinct("ratings");
  }

  async getDistinctPropertyTypes() {
    return await Hotel.distinct("propertyType");
  }

  async fetchHotelReviews(hotelCode, page, limit) {
    const hotel = await Hotel.findOne({ hotelCode: Number(hotelCode) });
    if (!hotel) throw new Error("Hotel not found");
  
    const skip = (page - 1) * limit;
  
    const [reviews, total] = await Promise.all([
      Review.find({ hotelId: hotel._id })
        .skip(skip)
        .limit(Number(limit))
        .sort({ date: -1 }),
      Review.countDocuments({ hotelId: hotel._id })
    ]);
  
    return { reviews, total };
  }

  async findById(id) {
    try {
      return await Hotel.findById(id);
    } catch (error) {
      throw new AppError('Lỗi khi tìm khách sạn', 500);
    }
  }

  async findByHotelCode(hotelCode) {
    try {
      return await Hotel.findOne({ hotelCode: parseInt(hotelCode) });
    } catch (error) {
      console.error('Error in HotelRepository.findByHotelCode:', error);
      throw error;
    }
  }

  async findAvailableHotels(filters = {}, skip = 0, limit = 5) {
    try {

      // 1. Khởi tạo query rỗng
      let query = {};

      // 2. Chỉ thêm điều kiện vào query khi có filters
      if (Object.keys(filters).length > 0) {
        // Lọc theo thành phố
        if (filters.city) {
          console.log("Đang tìm city:", filters.city);
          const city = await City.findOne({ name: { $regex: new RegExp(filters.city, 'i') } });
          if (city) {
            query.cityId = city._id;
            console.log("Tìm thấy city:", city);
          }
        }

        // Lọc theo đánh giá sao
        if (filters.star_ratings && filters.star_ratings.length > 0) {
          console.log("Lọc theo star ratings:", filters.star_ratings);
          query.ratings = {
            $in: filters.star_ratings.map(rating => parseFloat(rating))
          };
        }

        // Lọc theo loại khách sạn
        if (filters.property_type && filters.property_type.length > 0) {
          console.log("Lọc theo property type:", filters.property_type);
          query.propertyType = {
            $in: filters.property_type
          };
        }
      }

      // 3. Thực hiện query với populate
      const [hotels, total] = await Promise.all([
        Hotel.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .populate('cityId', 'name'),
        Hotel.countDocuments(query)
      ]);

      // 4. Tính toán tổng số trang
      const totalPages = Math.ceil(total / limit);

      // 5. Trả về kết quả
      return {
        hotels,
        total,
        page: parseInt(skip / limit) + 1,
        totalPages,
        limit: parseInt(limit)
      };
    } catch (error) {
      console.error("❌ Error in findAvailableHotels:", error);
      throw error;
    }
  }

  async countAvailableHotels(filters) {
    try {
      let query = {};

      // Lọc theo thành phố
      if (filters.city) {
        query.city = filters.city.toLowerCase();
      }

      // Lọc theo đánh giá sao
      if (filters.star_ratings && filters.star_ratings.length > 0) {
        query.ratings = {
          $in: filters.star_ratings.map(rating => parseFloat(rating))
        };
      }

      // Lọc theo loại khách sạn
      if (filters.property_type && filters.property_type.length > 0) {
        query.propertyType = {
          $in: filters.property_type
        };
      }

      // Lọc theo giá
      if (filters.minPrice || filters.maxPrice) {
        query.price = {};
        if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
        if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
      }

      // Lọc theo tiện nghi
      if (filters.amenities) {
        query.benefits = { $all: filters.amenities.split(',') };
      }

      return await Hotel.countDocuments(query);
    } catch (error) {
      console.error('Error in HotelRepository.countAvailableHotels:', error);
      throw error;
    }
  }

  async getNearbyHotels(cityId, page = 1, limit = 5) {
    try {
      // Nếu không có cityId, lấy tất cả khách sạn
      if (!cityId) {
        const skip = (page - 1) * limit;
        const [hotels, total] = await Promise.all([
          Hotel.find()
            .skip(skip)
            .limit(limit)
            .sort({ rating: -1 }), // Sắp xếp theo rating giảm dần
          Hotel.countDocuments()
        ]);

        return {
          hotels,
          total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          limit
        };
      }

      // Nếu có cityId, kiểm tra và chuyển đổi thành ObjectId
      let query = {};
      try {
        query.cityId = new mongoose.Types.ObjectId(cityId);
      } catch (error) {
        // Nếu không phải ObjectId hợp lệ, tìm theo cityId dạng string
        query.cityId = cityId;
      }

      const skip = (page - 1) * limit;
      const [hotels, total] = await Promise.all([
        Hotel.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ rating: -1 }), // Sắp xếp theo rating giảm dần
        Hotel.countDocuments(query)
      ]);

      return {
        hotels,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit
      };
    } catch (error) {
      console.error('Error in getNearbyHotels:', error);
      throw error;
    }
  }

  async getHotelFilters() {
    try {
      // Lấy tất cả ratings duy nhất (loại Number)
      const ratings = await Hotel.distinct("ratings");
      
      // Lấy tất cả propertyType duy nhất (loại String)
      const propertyTypes = await Hotel.distinct("propertyType");

      // Chuẩn hóa dữ liệu theo format yêu cầu
      const ratingsFilters = ratings.sort((a, b) => b - a).map(rating => ({
        id: `${rating}_star_rating`,
        title: `${rating} sao`,
        value: rating
      }));

      const propertyTypeFilters = propertyTypes.map(type => ({
        id: type.toLowerCase().replace(/\s+/g, '_'),
        title: type,
        value: type
      }));

      return {
        elements: [
          {
            filterId: "star_ratings",
            title: "Đánh giá sao",
            filters: ratingsFilters
          },
          {
            filterId: "property_type",
            title: "Loại khách sạn",
            filters: propertyTypeFilters
          }
        ]
      };
    } catch (error) {
      console.error('Error in getHotelFilters:', error);
      throw error;
    }
  }

  async getPopularDestinations() {
    try {
      return await City.find().limit(5);
    } catch (error) {
      console.error('Error in getPopularDestinations:', error);
      throw error;
    }
  }

  async getHotelReviews(hotelCode) {
    try {
      const hotel = await Hotel.findOne({ hotelCode: Number(hotelCode) });
      if (!hotel) throw new Error("Hotel not found");

      const [reviews, total] = await Promise.all([
        Review.find({ hotelId: hotel._id })
          .sort({ date: -1 })
          .populate('userId', 'firstName lastName email'), // Lấy cả firstName và lastName từ bảng Users
        Review.countDocuments({ hotelId: hotel._id })
      ]);

      return { reviews, total };
    } catch (error) {
      console.error('Error in getHotelReviews:', error);
      throw error;
    }
  }

  async addReview(hotelCode, userId, reviewData) {
    try {

      // Kiểm tra hotel có tồn tại không
      const hotel = await Hotel.findOne({ hotelCode: Number(hotelCode) });
      if (!hotel) {
        throw new Error('Không tìm thấy khách sạn');
      }

      // Kiểm tra xem user đã đặt phòng khách sạn này chưa
      const hasBooking = await Booking.findOne({
        userId,
        hotelId: hotel._id,
        status: 'completed'
      });

      // Tạo review mới
      const newReview = await Review.create({
        hotelId: hotel._id, // Sử dụng _id của hotel thay vì hotelCode
        userId,
        reviewerName: reviewData.reviewerName,
        rating: reviewData.rating,
        review: reviewData.review,
        verified: !!hasBooking
      });

      // Cập nhật rating trung bình của khách sạn
      const hotelReviews = await Review.find({ hotelId: hotel._id });
      const totalRating = hotelReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / hotelReviews.length;

      await Hotel.findByIdAndUpdate(hotel._id, {
        $set: { ratings: averageRating.toFixed(1) }
      });

      return newReview;
    } catch (error) {
      console.error('Repository: Error in addReview:', error);
      throw error;
    }
  }

  async findByPartnerId(partnerId) {
    try {
      const hotels = await Hotel.find({ partner_id: partnerId });
      return hotels;
    } catch (error) {
      console.error('❌ Repository: Lỗi khi tìm khách sạn:', error);
      throw new AppError('Lỗi khi tìm khách sạn', 500);
    }
  }
}

export default new HotelRepository();

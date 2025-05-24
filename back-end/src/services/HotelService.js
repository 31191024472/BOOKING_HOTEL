import hotelRepository from '../repositories/hotelRepository.js';
import RoomRepository from '../repositories/RoomRepository.js';
import BookingRepository from '../repositories/bookingRepository.js';

class HotelService {
  async getHotelBookingDetails(hotelCode, filters) {
    try {
      // Lấy thông tin khách sạn
      const hotel = await hotelRepository.findByHotelCode(hotelCode);
      if (!hotel) {
        return {
          success: false,
          message: "Không tìm thấy khách sạn"
        };
      }

      // Lấy danh sách phòng còn trống
      const rooms = await RoomRepository.findByHotelId(hotel._id);
      if (!rooms || rooms.length === 0) {
        return {
          success: false,
          message: "Không có phòng trống"
        };
      }

      // Format dữ liệu trả về
      const responseData = {
        // Thông tin khách sạn
        name: hotel.title,
        checkInTime: hotel.checkInTime || "14:00",
        checkOutTime: hotel.checkOutTime || "12:00",
        currentNightRate: hotel.price,
        cancellationPolicy: hotel.cancellationPolicy || "Miễn phí hủy phòng trong vòng 24h",
        maxGuestsAllowed: hotel.maxGuests || 4,
        maxRoomsAllowedPerGuest: hotel.maxRoomsPerGuest || 3,

        // Danh sách phòng
        rooms: rooms.map(room => ({
          roomId: room._id,
          roomType: room.roomType,
          roomName: room.description,
          maxGuests: room.maxOccupancy,
          availableRooms: room.availableRooms,
          price: room.pricePerNight,
          bedType: room.bedType,
          amenities: room.amenities,
          totalRooms: room.totalRooms
        }))
      };

      // Nếu có thông tin về ngày check-in/check-out
      if (filters.checkIn && filters.checkOut) {
        // Lấy danh sách booking trong khoảng thời gian
        const bookings = await BookingRepository.findByDateRange(
          hotel._id,
          filters.checkIn,
          filters.checkOut
        );

        // Tính toán số phòng còn trống cho mỗi loại phòng
        responseData.rooms = responseData.rooms.map(room => {
          const bookedRooms = bookings
            .filter(booking => booking.roomId.toString() === room.roomId.toString())
            .reduce((sum, booking) => sum + booking.quantity, 0);

          return {
            ...room,
            availableRooms: room.availableRooms - bookedRooms
          };
        });

        // Lọc phòng theo điều kiện
        responseData.rooms = responseData.rooms.filter(room => {
          const hasEnoughRooms = room.availableRooms >= filters.numberOfRooms;
          const hasEnoughGuests = room.maxGuests >= filters.numberOfGuests;
          return hasEnoughRooms && hasEnoughGuests;
        });
      }

      return {
        success: true,
        data: responseData
      };

    } catch (error) {
      console.error("❌ Error in HotelService.getHotelBookingDetails:", error);
      return {
        success: false,
        message: "Lỗi server khi lấy thông tin đặt phòng"
      };
    }
  }

  async getHotels(filters, skip = 0, limit = 5) {
    try {
      // console.log("=== BƯỚC 1: Nhận request từ controller ===");
      // console.log("Filters:", filters);
      // console.log("Skip:", skip);
      // console.log("Limit:", limit);

      const result = await hotelRepository.findAvailableHotels(filters, skip, limit);
      
      // console.log("=== BƯỚC 2: Kết quả từ repository ===");
      // console.log("Số lượng khách sạn:", result.hotels.length);
      // console.log("Tổng số khách sạn:", result.total);
      // console.log("Dữ liệu sau khi fillter: ", result)

      return result;
    } catch (error) {
      console.error("❌ Error in getHotels service:", error);
      throw error;
    }
  }

  async getNearbyHotels(cityId, page = 1, limit = 5) {
    try {
      const result = await hotelRepository.getNearbyHotels(cityId, page, limit);
      
      if (!result.hotels || result.hotels.length === 0) {
        return {
          success: true,
          data: [] // Trả về mảng rỗng thay vì throw error
        };
      }

      // Chuyển đổi dữ liệu để phù hợp với frontend
      const formattedHotels = result.hotels.map(hotel => ({
        hotelCode: hotel.hotelCode,
        title: hotel.title,
        subtitle: hotel.subtitle,
        description: hotel.description,
        imageUrls: hotel.imageUrls || [],
        benefits: hotel.benefits || [],
        ratings: hotel.ratings || 0,
        propertyType: hotel.propertyType,
        cityId: hotel.cityId
      }));

      return {
        success: true,
        data: formattedHotels,
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          totalItems: result.total,
          itemsPerPage: result.limit
        }
      };
    } catch (error) {
      console.error('Error in HotelService.getNearbyHotels:', error);
      return {
        success: true,
        data: [] // Trả về mảng rỗng khi có lỗi
      };
    }
  }

  async getAvailableCities() {
    try {
      return await hotelRepository.getAvailableCities();
    } catch (error) {
      console.error('Error in HotelService.getAvailableCities:', error);
      throw error;
    }
  }

  async getHotelFilters() {
    try {
      return await hotelRepository.getHotelFilters();
    } catch (error) {
      console.error('Error in HotelService.getHotelFilters:', error);
      throw error;
    }
  }

  async getPopularDestinations() {
    try {
      return await hotelRepository.getPopularDestinations();
    } catch (error) {
      console.error('Error in HotelService.getPopularDestinations:', error);
      throw error;
    }
  }

  async getHotelReviews(hotelCode) {
    try {
      const reviewsResult = await hotelRepository.getHotelReviews(hotelCode);
      
      // Tính toán averageRating
      const totalRating = reviewsResult.reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = reviewsResult.reviews.length > 0
        ? (totalRating / reviewsResult.reviews.length).toFixed(1)
        : 0;

      // Tính toán starCounts
      const starCounts = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
      reviewsResult.reviews.forEach((review) => {
        const star = Math.floor(review.rating);
        if (starCounts[star] !== undefined) starCounts[star]++;
      });

      return {
        reviews: reviewsResult.reviews,
        total: reviewsResult.total,
        averageRating: Number(averageRating),
        starCounts
      };
    } catch (error) {
      console.error('Error in HotelService.getHotelReviews:', error);
      throw error;
    }
  }

  async findByHotelCode(hotelCode) {
    try {
      const hotel = await hotelRepository.findByHotelCode(hotelCode);
      if (!hotel) {
        return null;
      }
      return hotel;
    } catch (error) {
      console.error('Error in HotelService.findByHotelCode:', error);
      throw error;
    }
  }

  async addHotelReview(hotelCode, userId, reviewData) {
    try {
      console.log('Adding review with data:', { hotelCode, userId, reviewData });

      // Validate dữ liệu đầu vào
      if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        return {
          success: false,
          errors: ['Đánh giá phải từ 1-5 sao']
        };
      }

      if (!reviewData.review || reviewData.review.trim().length === 0) {
        return {
          success: false,
          errors: ['Nội dung đánh giá không được để trống']
        };
      }

      const newReview = await hotelRepository.addReview(hotelCode, userId, reviewData);
      console.log('Review added successfully:', newReview);

      return {
        success: true,
        data: newReview
      };
    } catch (error) {
      console.error('Error in HotelService.addHotelReview:', error);
      return {
        success: false,
        errors: ['Lỗi server khi thêm đánh giá']
      };
    }
  }

  // Thêm các phương thức từ hotelServices.js
  async getAllHotels() {
    try {
      return await hotelRepository.findAllHotels();
    } catch (error) {
      console.error('Error in HotelService.getAllHotels:', error);
      throw error;
    }
  }

  async getHotelByCode(hotelCode) {
    try {
      return await hotelRepository.findHotelByCode(hotelCode);
    } catch (error) {
      console.error('Error in HotelService.getHotelByCode:', error);
      throw error;
    }
  }

  async addHotel(hotelData) {
    try {
      return await hotelRepository.createHotel(hotelData);
    } catch (error) {
      console.error('Error in HotelService.addHotel:', error);
      throw error;
    }
  }

  async editHotel(hotelCode, updatedData) {
    try {
      return await hotelRepository.updateHotel(hotelCode, updatedData);
    } catch (error) {
      console.error('Error in HotelService.editHotel:', error);
      throw error;
    }
  }

  async removeHotel(hotelCode) {
    try {
      return await hotelRepository.deleteHotel(hotelCode);
    } catch (error) {
      console.error('Error in HotelService.removeHotel:', error);
      throw error;
    }
  }

  async getHotelsByCity(cityId) {
    try {
      return await hotelRepository.findHotelsByCity(cityId);
    } catch (error) {
      console.error('Error in HotelService.getHotelsByCity:', error);
      throw new Error('Lỗi khi lấy danh sách khách sạn từ database');
    }
  }

  async getFilters() {
    try {
      const starRatings = await hotelRepository.getDistinctRatings();
      const propertyTypes = await hotelRepository.getDistinctPropertyTypes();
    
      return {
        isLoading: false,
        data: {
          elements: [
            {
              filterId: "star_ratings",
              title: "Star ratings",
              filters: starRatings.sort((a, b) => b - a).map((rating) => ({
                id: `${rating}_star_rating`,
                title: `${rating} Star`,
                value: rating.toString(),
              })),
            },
            {
              filterId: "property_type",
              title: "Property type",
              filters: propertyTypes.map((type) => ({
                id: `prop_type_${type.toLowerCase().replace(/\s+/g, "_")}`,
                title: type,
              })),
            },
          ],
        },
        errors: [],
      };
    } catch (error) {
      console.error('Error in HotelService.getFilters:', error);
      throw error;
    }
  }
}

export default new HotelService(); 
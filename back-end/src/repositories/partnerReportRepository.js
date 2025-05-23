import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

class PartnerReportRepository {
  // Lấy báo cáo đặt phòng
  async getBookingReports(partnerId, startDate, endDate, status) {
    try {
      // Lấy tất cả khách sạn của partner
      const hotels = await Hotel.find({ partner_id: partnerId });
      const hotelCodes = hotels.map(hotel => hotel.hotelCode);

      // Tạo query cơ bản
      const query = {
        hotelId: { $in: hotelCodes },
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };

      // Thêm điều kiện status nếu có
      if (status && status !== 'all') {
        query.status = status;
      }

      // Lấy dữ liệu đặt phòng
      const bookings = await Booking.find(query)
        .populate('userId', 'firstName lastName email phone')
        .populate('roomId', 'name roomType pricePerNight')
        .sort({ createdAt: -1 });

      // Tính toán thống kê
      const stats = {
        totalBookings: bookings.length,
        totalRevenue: bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0),
        statusBreakdown: {},
        bookingsByDate: {}
      };

      // Phân loại theo trạng thái và ngày
      bookings.forEach(booking => {
        // Phân loại theo trạng thái
        stats.statusBreakdown[booking.status] = (stats.statusBreakdown[booking.status] || 0) + 1;
        
        // Phân loại theo ngày
        const date = booking.createdAt.toISOString().split('T')[0];
        if (!stats.bookingsByDate[date]) {
          stats.bookingsByDate[date] = {
            count: 0,
            revenue: 0
          };
        }
        stats.bookingsByDate[date].count++;
        stats.bookingsByDate[date].revenue += booking.totalPrice || 0;
      });

      return {
        bookings,
        stats
      };
    } catch (error) {
      console.error('🚨 Error in getBookingReports:', error);
      throw error;
    }
  }

  // Lấy báo cáo doanh thu
  async getRevenueReports(partnerId, startDate, endDate) {
    try {
      // Lấy tất cả khách sạn của partner
      const hotels = await Hotel.find({ partner_id: partnerId });
      const hotelCodes = hotels.map(hotel => hotel.hotelCode);

      // Lấy tất cả booking có trạng thái Confirmed
      const bookings = await Booking.find({
        hotelId: { $in: hotelCodes },
        status: 'Confirmed',
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }).populate('roomId', 'name roomType pricePerNight');

      // Tính tổng doanh thu
      const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

      // Phân loại doanh thu theo ngày
      const dailyRevenue = {};
      bookings.forEach(booking => {
        const date = booking.createdAt.toISOString().split('T')[0];
        if (!dailyRevenue[date]) {
          dailyRevenue[date] = {
            revenue: 0,
            bookingCount: 0
          };
        }
        dailyRevenue[date].revenue += booking.totalPrice || 0;
        dailyRevenue[date].bookingCount += 1;
      });

      // Phân loại doanh thu theo khách sạn
      const revenueByHotel = {};
      bookings.forEach(booking => {
        if (!revenueByHotel[booking.hotelId]) {
          revenueByHotel[booking.hotelId] = {
            revenue: 0,
            bookingCount: 0
          };
        }
        revenueByHotel[booking.hotelId].revenue += booking.totalPrice || 0;
        revenueByHotel[booking.hotelId].bookingCount += 1;
      });

      // Thêm thông tin khách sạn
      const revenueByHotelWithInfo = await Promise.all(
        Object.entries(revenueByHotel).map(async ([hotelId, data]) => {
          const hotel = await Hotel.findOne({ hotelCode: parseInt(hotelId) });
          return {
            hotelId,
            revenue: data.revenue,
            bookingCount: data.bookingCount,
            hotelInfo: {
              title: hotel?.title || 'Unknown',
              hotelCode: hotel?.hotelCode
            }
          };
        })
      );

      return {
        dailyRevenue: Object.entries(dailyRevenue).map(([date, data]) => ({
          date,
          revenue: data.revenue,
          bookingCount: data.bookingCount
        })),
        totalRevenue,
        revenueByHotel: revenueByHotelWithInfo
      };
    } catch (error) {
      console.error('🚨 Error in getRevenueReports:', error);
      throw error;
    }
  }

  // Lấy báo cáo tỷ lệ đặt phòng
  async getOccupancyReports(partnerId, startDate, endDate, hotelCode) {
    try {
      // Lấy danh sách khách sạn
      const hotels = hotelCode 
        ? await Hotel.find({ hotelCode: parseInt(hotelCode), partner_id: partnerId })
        : await Hotel.find({ partner_id: partnerId });
      
      const hotelCodes = hotels.map(hotel => hotel.hotelCode);

      // Lấy tổng số phòng của mỗi khách sạn
      const rooms = await Room.find({ hotelCode: { $in: hotelCodes } });
      const totalRooms = rooms.reduce((sum, room) => sum + (room.totalRooms || 1), 0);

      // Lấy số phòng đã đặt trong khoảng thời gian
      const bookings = await Booking.find({
        hotelId: { $in: hotelCodes },
        checkIn: { $lte: new Date(endDate) },
        checkOut: { $gte: new Date(startDate) },
        status: 'Confirmed'
      });

      // Tính toán tỷ lệ đặt phòng theo ngày
      const occupancyByDate = {};
      const dateRange = [];
      let currentDate = new Date(startDate);
      
      while (currentDate <= new Date(endDate)) {
        const dateStr = currentDate.toISOString().split('T')[0];
        dateRange.push(dateStr);
        occupancyByDate[dateStr] = {
          totalRooms,
          bookedRooms: 0,
          occupancyRate: 0
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Tính số phòng đã đặt cho mỗi ngày
      bookings.forEach(booking => {
        let currentDate = new Date(booking.checkIn);
        while (currentDate <= booking.checkOut && currentDate <= new Date(endDate)) {
          const dateStr = currentDate.toISOString().split('T')[0];
          if (occupancyByDate[dateStr]) {
            occupancyByDate[dateStr].bookedRooms += booking.rooms || 1;
            occupancyByDate[dateStr].occupancyRate = 
              (occupancyByDate[dateStr].bookedRooms / totalRooms) * 100;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });

      // Tính tỷ lệ đặt phòng trung bình
      const averageOccupancyRate = Object.values(occupancyByDate)
        .reduce((sum, day) => sum + day.occupancyRate, 0) / dateRange.length;

      return {
        occupancyByDate,
        averageOccupancyRate,
        totalRooms,
        totalBookedRooms: bookings.reduce((sum, booking) => sum + (booking.rooms || 1), 0),
        hotelInfo: hotels.map(hotel => ({
          hotelCode: hotel.hotelCode,
          title: hotel.title
        }))
      };
    } catch (error) {
      console.error('🚨 Error in getOccupancyReports:', error);
      throw error;
    }
  }
}

export default new PartnerReportRepository(); 
import partnerService from '../services/partnerService.js';
import bookingServices from '../services/bookingServices.js';
import * as cityService from "../services/adminCityService.js";
import { validateRequest } from '../utils/validator.js';
import partnerReportService from '../services/partnerReportService.js';

// Quản lý khách sạn
export const getHotels = async (req, res) => {
  try {
    const hotels = await partnerService.getHotels(req.user._id);
    res.json({
      success: true,
      data: hotels
    });
  } catch (error) {
    console.error('🚨 Error in getHotels:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách khách sạn'
    });
  }
};

export const getCities = async (req, res) => {
  try {
    const cities = await cityService.getAllCities();
    res.status(200).json({ cities });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách thành phố", error });
  }
};

export const createHotel = async (req, res) => {
  try {

    const hotel = await partnerService.createHotel(req.user._id, req.body);

    return res.status(201).json({
      success: true,
      message: 'Tạo khách sạn thành công, đang chờ duyệt',
      data: hotel
    });
  } catch (error) {
    console.error('🚨 Error in createHotel:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi tạo khách sạn mới'
    });
  }
};


export const updateHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const updateData = req.body;
    // 1. Kiểm tra dữ liệu đầu vào
    if (!hotelId) {
      console.error('❌ Thiếu hotelId');
      return res.status(400).json({
        success: false,
        message: 'Mã khách sạn không được để trống'
      });
    }

    // 2. Kiểm tra các trường bắt buộc
    const requiredFields = ['title', 'subtitle', 'cityId'];
    const missingFields = requiredFields.filter(field => !updateData[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Thiếu trường bắt buộc:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Thiếu các trường bắt buộc: ${missingFields.join(', ')}`
      });
    }

    // 3. Validate dữ liệu
    if (updateData.ratings && (updateData.ratings < 0 || updateData.ratings > 5)) {
      console.error('❌ Đánh giá không hợp lệ');
      return res.status(400).json({
        success: false,
        message: 'Đánh giá phải từ 0 đến 5'
      });
    }

    if (updateData.benefits && !Array.isArray(updateData.benefits)) {
      console.error('❌ Benefits phải là mảng');
      return res.status(400).json({
        success: false,
        message: 'Benefits phải là mảng'
      });
    }

    if (updateData.imageUrls && !Array.isArray(updateData.imageUrls)) {
      console.error('❌ imageUrls phải là mảng');
      return res.status(400).json({
        success: false,
        message: 'imageUrls phải là mảng'
      });
    }

    // 4. Gọi service để cập nhật
    const updatedHotel = await partnerService.updateHotel(req.user._id, hotelId, updateData);
    return res.status(200).json({
      success: true,
      message: 'Cập nhật khách sạn thành công',
      data: updatedHotel
    });

  } catch (error) {
    console.error('❌ Lỗi trong updateHotel:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Mã khách sạn không hợp lệ'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật khách sạn'
    });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    await partnerService.deleteHotel(
      req.user._id,
      req.params.hotelId
    );

    res.json({
      success: true,
      message: 'Xóa khách sạn thành công'
    });
  } catch (error) {
    console.error('🚨 Error in deleteHotel:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi xóa khách sạn'
    });
  }
};

export const getHotelDetails = async (req, res) => {
  try {
    const hotel = await partnerService.getHotelDetails(
      req.user._id,
      req.params.hotelId
    );

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách sạn'
      });
    }

    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('🚨 Error in getHotelDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin khách sạn'
    });
  }
};

// Quản lý phòng
export const getRooms = async (req, res) => {
  try {
    const rooms = await partnerService.getRooms(
      req.user._id,
      req.params.hotelId
    );
    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    console.error('🚨 Error in getRooms:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách phòng'
    });
  }
};

export const createRoom = async (req, res) => {
  try {
    console.log('🚀 Controller: Bắt đầu tạo phòng mới:', {
      hotelId: req.params.hotelId,
      roomData: req.body
    });

    // // 1. Validate dữ liệu đầu vào
    // const validation = validateRequest(req.body, {
    //   roomType: 'required|string',
    //   description: 'required|string',
    //   pricePerNight: 'required|numeric|min:0',
    //   maxOccupancy: 'required|numeric|min:1',
    //   bedType: 'required|string',
    //   amenities: 'required|array',
    //   totalRooms: 'required|numeric|min:1',
    //   availableRooms: 'required|numeric|min:0',
    //   imageUrls: 'array',
    //   isActive: 'boolean',
    //   'discount.percentage': 'numeric|min:0|max:100'
    // });

    // if (!validation.success) {
    //   console.error('❌ Validation error:', validation);
    //   return res.status(400).json(validation);
    // }

    // 2. Gọi service để tạo phòng
    const room = await partnerService.createRoom(
      req.user._id,
      req.params.hotelId,
      req.body
    );

    // console.log('✅ Controller: Tạo phòng thành công:', {
    //   roomId: room._id,
    //   hotelId: room.hotelId
    // });

    return res.status(201).json({
      success: true,
      message: 'Tạo phòng thành công',
      data: room
    });

  } catch (error) {
    console.error('❌ Controller: Lỗi trong createRoom:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi tạo phòng mới'
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    console.log('🚀 Controller: Bắt đầu cập nhật phòng:', {
      roomId: req.params.roomId,
      updateData: req.body
    });
    const room = await partnerService.updateRoom(
      req.user._id,
      req.params.roomId,
      req.body
    );
    return res.status(200).json({
      success: true,
      message: 'Cập nhật phòng thành công',
      data: room
    });

  } catch (error) {
    console.error('❌ Controller: Lỗi trong updateRoom:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật phòng'
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    // Kiểm tra quyền sở hữu và xóa phòng
    await partnerService.deleteRoom(
      req.user._id,
      req.params.roomId
    );

    res.json({
      success: true,
      message: 'Xóa phòng thành công'
    });
  } catch (error) {
    console.error('🚨 Error in deleteRoom:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi xóa phòng'
    });
  }
};

// Quản lý đặt phòng
export const getBookingsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const bookings = await bookingServices.getBookingsByHotel(hotelId);

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('❌ Controller: Lỗi khi lấy booking theo khách sạn:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi server khi lấy danh sách booking',
    });
  }
};
// Quản lý khuyến mãi
export const getDiscounts = async (req, res) => {
  try {
    const discounts = await partnerService.getDiscounts(req.user._id);
    res.json({
      success: true,
      data: discounts
    });
  } catch (error) {
    console.error('🚨 Error in getDiscounts:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách khuyến mãi'
    });
  }
};

export const createDiscount = async (req, res) => {
  try {
    const validation = validateRequest(req.body, {
      code: 'required|string|minLength:3|maxLength:20',
      name: 'required|string',
      description: 'required|string',
      discountType: 'required|in:percentage,fixed',
      discountValue: 'required|numeric|min:0',
      minOrderValue: 'numeric|min:0',
      maxDiscountValue: 'numeric|min:0',
      startDate: 'required|date',
      endDate: 'required|date',
      hotelId: 'required|string',
      usageLimit: 'numeric|min:1',
      status: 'in:active,inactive'
    });

    if (!validation.success) {
      return res.status(400).json(validation);
    }

    const discount = await partnerService.createDiscount(
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      data: discount
    });
  } catch (error) {
    console.error('🚨 Error in createDiscount:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi tạo khuyến mãi mới'
    });
  }
};

export const updateDiscount = async (req, res) => {
  try {
    const validation = validateRequest(req.body, {
      name: 'string',
      description: 'string',
      discountType: 'in:percentage,fixed',
      discountValue: 'numeric|min:0',
      minOrderValue: 'numeric|min:0',
      maxDiscountValue: 'numeric|min:0',
      startDate: 'date',
      endDate: 'date',
      usageLimit: 'numeric|min:1',
      status: 'in:active,inactive'
    });

    if (!validation.success) {
      return res.status(400).json(validation);
    }

    const discount = await partnerService.updateDiscount(
      req.user._id,
      req.params.discountId,
      req.body
    );

    res.json({
      success: true,
      data: discount
    });
  } catch (error) {
    console.error('🚨 Error in updateDiscount:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật khuyến mãi'
    });
  }
};

export const deleteDiscount = async (req, res) => {
  try {
    await partnerService.deleteDiscount(
      req.user._id,
      req.params.discountId
    );

    res.json({
      success: true,
      message: 'Xóa khuyến mãi thành công'
    });
  } catch (error) {
    console.error('🚨 Error in deleteDiscount:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi xóa khuyến mãi'
    });
  }
};

export const getDiscountDetails = async (req, res) => {
  try {
    const discount = await partnerService.getDiscountDetails(
      req.user._id,
      req.params.discountId
    );

    res.json({
      success: true,
      data: discount
    });
  } catch (error) {
    console.error('🚨 Error in getDiscountDetails:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thông tin khuyến mãi'
    });
  }
};

// Quản lý tài khoản
export const getProfile = async (req, res) => {
  try {
    const profile = await partnerService.getProfile(req.user._id);
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('🚨 Error in getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin profile'
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const validation = validateRequest(req.body, {
      'profile.firstName': 'string',
      'profile.lastName': 'string',
      'profile.phone': 'string',
      'partnerInfo.companyName': 'string',
      'partnerInfo.taxCode': 'string',
      'partnerInfo.address': 'string'
    });

    if (!validation.success) {
      return res.status(400).json(validation);
    }

    const profile = await partnerService.updateProfile(
      req.user._id,
      req.body
    );

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('🚨 Error in updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật thông tin profile'
    });
  }
};

// Thống kê và báo cáo
export const getDashboardStats = async (req, res) => {
  try {
    const partnerId = req.user._id;
    const stats = await partnerService.getDashboardStats(partnerId);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('🚨 Error in getDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê dashboard'
    });
  }
};

// Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const validation = validateRequest(req.body, {
      currentPassword: 'required|string',
      newPassword: 'required|string|minLength:6',
      confirmPassword: 'required|string'
    });

    if (!validation.success) {
      return res.status(400).json(validation);
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới và xác nhận mật khẩu không khớp'
      });
    }

    // Gọi service để đổi mật khẩu
    await partnerService.changePassword(
      req.user._id,
      currentPassword,
      newPassword
    );

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('🚨 Error in changePassword:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi đổi mật khẩu'
    });
  }
};

// Lấy báo cáo đặt phòng
export const getBookingReports = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const reports = await partnerReportService.getBookingReports(
      req.user._id,
      startDate,
      endDate,
      status
    );
    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('🚨 Error in getBookingReports:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy báo cáo đặt phòng'
    });
  }
};

// Lấy báo cáo doanh thu
export const getRevenueReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const reports = await partnerReportService.getRevenueReports(
      req.user._id,
      startDate,
      endDate
    );
    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('🚨 Error in getRevenueReports:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy báo cáo doanh thu'
    });
  }
};

// Lấy báo cáo tỷ lệ đặt phòng
export const getOccupancyReports = async (req, res) => {
  try {
    const { startDate, endDate, hotelId } = req.query;
    const reports = await partnerReportService.getOccupancyReports(
      req.user._id,
      startDate,
      endDate,
      hotelId
    );
    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('🚨 Error in getOccupancyReports:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy báo cáo tỷ lệ đặt phòng'
    });
  }
};

// Lấy chi tiết phòng
export const getRoomDetails = async (req, res) => {
  try {
    const room = await partnerService.getRoomDetails(
      req.user._id,
      req.params.roomId
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng'
      });
    }

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('🚨 Error in getRoomDetails:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thông tin phòng'
    });
  }
};

// Cập nhật trạng thái đặt phòng
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    // Kiểm tra trạng thái hợp lệ
    if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ"
      });
    }

    // Cập nhật trạng thái
    const updatedBooking = await bookingServices.updateBookingStatus(bookingId, status);

    res.json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái đặt phòng"
    });
  }
};

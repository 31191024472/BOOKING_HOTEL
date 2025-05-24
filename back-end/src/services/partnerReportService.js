import partnerReportRepository from '../repositories/partnerReportRepository.js';
import AppError from '../utils/AppError.js';

class PartnerReportService {
  // Lấy báo cáo đặt phòng
  async getBookingReports(partnerId, startDate, endDate, status) {
    try {
      // Validate input
      if (!partnerId) {
        throw new AppError('Thiếu thông tin partner', 400);
      }
      if (!startDate || !endDate) {
        throw new AppError('Thiếu thông tin ngày bắt đầu hoặc kết thúc', 400);
      }

      // Validate date format
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new AppError('Định dạng ngày không hợp lệ', 400);
      }

      // Validate date range
      if (end < start) {
        throw new AppError('Ngày kết thúc phải sau ngày bắt đầu', 400);
      }

      // Validate status if provided
      if (status && !['all', 'Pending', 'Confirmed', 'Cancelled', 'Completed'].includes(status)) {
        throw new AppError('Trạng thái không hợp lệ', 400);
      }

      return await partnerReportRepository.getBookingReports(partnerId, startDate, endDate, status);
    } catch (error) {
      console.error('🚨 Error in getBookingReports service:', error);
      throw error instanceof AppError ? error : new AppError('Lỗi khi lấy báo cáo đặt phòng', 500);
    }
  }

  // Lấy báo cáo doanh thu
  async getRevenueReports(partnerId, startDate, endDate) {
    try {
      // Validate input
      if (!partnerId) {
        throw new AppError('Thiếu thông tin partner', 400);
      }
      if (!startDate || !endDate) {
        throw new AppError('Thiếu thông tin ngày bắt đầu hoặc kết thúc', 400);
      }

      // Validate date format
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new AppError('Định dạng ngày không hợp lệ', 400);
      }

      // Validate date range
      if (end < start) {
        throw new AppError('Ngày kết thúc phải sau ngày bắt đầu', 400);
      }

      return await partnerReportRepository.getRevenueReports(partnerId, startDate, endDate);
    } catch (error) {
      console.error('🚨 Error in getRevenueReports service:', error);
      throw error instanceof AppError ? error : new AppError('Lỗi khi lấy báo cáo doanh thu', 500);
    }
  }

  // Lấy báo cáo tỷ lệ đặt phòng
  async getOccupancyReports(partnerId, startDate, endDate, hotelId) {
    try {
      // Validate input
      if (!partnerId) {
        throw new AppError('Thiếu thông tin partner', 400);
      }
      if (!startDate || !endDate) {
        throw new AppError('Thiếu thông tin ngày bắt đầu hoặc kết thúc', 400);
      }

      // Validate date format
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new AppError('Định dạng ngày không hợp lệ', 400);
      }

      // Validate date range
      if (end < start) {
        throw new AppError('Ngày kết thúc phải sau ngày bắt đầu', 400);
      }

      return await partnerReportRepository.getOccupancyReports(partnerId, startDate, endDate, hotelId);
    } catch (error) {
      console.error('🚨 Error in getOccupancyReports service:', error);
      throw error instanceof AppError ? error : new AppError('Lỗi khi lấy báo cáo tỷ lệ đặt phòng', 500);
    }
  }
}

export default new PartnerReportService(); 
/**
 * Số lượng khách tối đa được phép nhập
 */
export const MAX_GUESTS_INPUT_VALUE = 10;

/**
 * Các thông báo liên quan đến đăng ký người dùng.
 */
export const REGISTRATION_MESSAGES = {
  SUCCESS: 'Tạo người dùng thành công. Đang chuyển hướng đến trang đăng nhập...',
};

/**
 * Các thông báo liên quan đến đăng nhập người dùng.
 */
export const LOGIN_MESSAGES = {
  FAILED: 'Vui lòng nhập email và mật khẩu hợp lệ',
};

/**
 * Đại diện cho thông tin thuế mặc định cho việc đặt phòng khách sạn.
 */
export const DEFAULT_TAX_DETAILS =
  'GST: 12% trên INR 0 - 2,500, 12% trên INR 2,500 - 7,500, 18% trên INR 7,500 trở lên';

/**
 * Nhãn bộ lọc sắp xếp
 */
export const SORTING_FILTER_LABELS = Object.freeze({
  PRICE_LOW_TO_HIGH: 'Giá: Thấp đến Cao',
  PRICE_HIGH_TO_LOW: 'Giá: Cao đến Thấp',
  RATING_LOW_TO_HIGH: 'Đánh giá: Thấp đến Cao',
  RATING_HIGH_TO_LOW: 'Đánh giá: Cao đến Thấp',
});

/**
 * Định dạng giá với dấu chấm cho mỗi nghìn.
 * @param {number} price - Giá cần được định dạng.
 * @returns {string} - Giá đã được định dạng.
 *
 * @example
 * const formattedPrice = formatPrice(1000000); // Trả về '1.000.000 VNĐ'
 * const formattedPrice = formatPrice(1000); // Trả về '1.000 VNĐ'
 */
const formatPrice = (price) => {
  if (!price) return parseFloat(0).toLocaleString('vi-VN') + ' VNĐ';
  return parseFloat(price).toLocaleString('vi-VN') + ' VNĐ';
};

export { formatPrice };

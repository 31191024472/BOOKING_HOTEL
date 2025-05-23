/**
 * Kiểm tra xem một đối tượng có rỗng hay không.
 * @param {Object} obj - Đối tượng cần kiểm tra.
 * @returns {boolean} - True nếu đối tượng rỗng, false nếu không.
 */
export default function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

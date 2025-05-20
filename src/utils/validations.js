/**
 * Đối tượng tiện ích cho việc xác thực trường.
 * @namespace validations
 */
const validations = {
  /**
   * Quy tắc xác thực trường.
   * @memberof validations
   * @property {object} email - Quy tắc xác thực cho trường email.
   * @property {boolean} email.required - Chỉ ra trường email có bắt buộc hay không.
   * @property {RegExp} email.pattern - Mẫu biểu thức chính quy để xác thực trường email.
   */
  fields: {
    email: {
      required: true,
      pattern: /^[^\s-]\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}[^\s-]$/i,
    },
  },

  /**
   * Xác thực giá trị trường dựa trên các quy tắc xác thực đã chỉ định.
   * @memberof validations
   * @param {string} field - Tên của trường cần xác thực.
   * @param {string} value - Giá trị của trường cần xác thực.
   * @returns {boolean} - Chỉ ra giá trị trường có hợp lệ hay không.
   */
  validate(field, value) {
    return this.fields[field] ? this.fields[field].pattern.test(value) : false;
  },
};

export default validations;

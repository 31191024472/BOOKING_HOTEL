class Validator {
  constructor() {
    this.errors = [];
  }

  // Kiểm tra giá trị bắt buộc
  required(value, field) {
    if (value === undefined || value === null || value === '') {
      this.errors.push(`${field} là bắt buộc`);
      return false;
    }
    return true;
  }

  // Kiểm tra kiểu string
  string(value, field) {
    if (value !== undefined && value !== null && typeof value !== 'string') {
      this.errors.push(`${field} phải là chuỗi`);
      return false;
    }
    return true;
  }

  // Kiểm tra kiểu number
  numeric(value, field) {
    if (value !== undefined && value !== null && isNaN(Number(value))) {
      this.errors.push(`${field} phải là số`);
      return false;
    }
    return true;
  }

  // Kiểm tra email
  email(value, field) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      this.errors.push(`${field} không hợp lệ`);
      return false;
    }
    return true;
  }

  // Kiểm tra độ dài tối thiểu
  minLength(value, field, min) {
    if (value && value.length < min) {
      this.errors.push(`${field} phải có ít nhất ${min} ký tự`);
      return false;
    }
    return true;
  }

  // Kiểm tra độ dài tối đa
  maxLength(value, field, max) {
    if (value && value.length > max) {
      this.errors.push(`${field} phải có tối đa ${max} ký tự`);
      return false;
    }
    return true;
  }

  // Kiểm tra giá trị tối thiểu
  min(value, field, min) {
    if (value !== undefined && value !== null && Number(value) < min) {
      this.errors.push(`${field} phải lớn hơn hoặc bằng ${min}`);
      return false;
    }
    return true;
  }

  // Kiểm tra giá trị tối đa
  max(value, field, max) {
    if (value !== undefined && value !== null && Number(value) > max) {
      this.errors.push(`${field} phải nhỏ hơn hoặc bằng ${max}`);
      return false;
    }
    return true;
  }

  // Kiểm tra mảng
  array(value, field) {
    if (value && !Array.isArray(value)) {
      this.errors.push(`${field} phải là mảng`);
      return false;
    }
    return true;
  }

  // Kiểm tra ngày tháng
  date(value, field) {
    if (value && isNaN(Date.parse(value))) {
      this.errors.push(`${field} không phải là ngày tháng hợp lệ`);
      return false;
    }
    return true;
  }

  // Kiểm tra giá trị trong danh sách
  in(value, field, allowedValues) {
    if (value && !allowedValues.includes(value)) {
      this.errors.push(`${field} phải là một trong các giá trị: ${allowedValues.join(', ')}`);
      return false;
    }
    return true;
  }

  // Kiểm tra URL
  url(value, field) {
    try {
      if (value) {
        new URL(value);
      }
      return true;
    } catch {
      this.errors.push(`${field} không phải là URL hợp lệ`);
      return false;
    }
  }

  // Kiểm tra số điện thoại
  phone(value, field) {
    const phoneRegex = /^[0-9]{10,11}$/;
    if (value && !phoneRegex.test(value.replace(/[^0-9]/g, ''))) {
      this.errors.push(`${field} không phải là số điện thoại hợp lệ`);
      return false;
    }
    return true;
  }
}

// Hàm validate request
export const validateRequest = (data, rules) => {
  const validator = new Validator();
  const errors = [];

  // Duyệt qua các rules
  for (const [field, ruleString] of Object.entries(rules)) {
    const rules = ruleString.split('|');
    const value = field.includes('.') 
      ? field.split('.').reduce((obj, key) => obj?.[key], data)
      : data[field];

    // Áp dụng từng rule
    for (const rule of rules) {
      const [ruleName, ...params] = rule.split(':');
      
      switch (ruleName) {
        case 'required':
          if (!validator.required(value, field)) {
            errors.push(...validator.errors);
          }
          break;
        case 'string':
          if (!validator.string(value, field)) {
            errors.push(...validator.errors);
          }
          break;
        case 'numeric':
          if (!validator.numeric(value, field)) {
            errors.push(...validator.errors);
          }
          break;
        case 'email':
          if (!validator.email(value, field)) {
            errors.push(...validator.errors);
          }
          break;
        case 'minLength':
          if (!validator.minLength(value, field, parseInt(params[0]))) {
            errors.push(...validator.errors);
          }
          break;
        case 'maxLength':
          if (!validator.maxLength(value, field, parseInt(params[0]))) {
            errors.push(...validator.errors);
          }
          break;
        case 'min':
          if (!validator.min(value, field, parseInt(params[0]))) {
            errors.push(...validator.errors);
          }
          break;
        case 'max':
          if (!validator.max(value, field, parseInt(params[0]))) {
            errors.push(...validator.errors);
          }
          break;
        case 'array':
          if (!validator.array(value, field)) {
            errors.push(...validator.errors);
          }
          break;
        case 'date':
          if (!validator.date(value, field)) {
            errors.push(...validator.errors);
          }
          break;
        case 'in':
          if (!validator.in(value, field, params[0].split(','))) {
            errors.push(...validator.errors);
          }
          break;
        case 'url':
          if (!validator.url(value, field)) {
            errors.push(...validator.errors);
          }
          break;
        case 'phone':
          if (!validator.phone(value, field)) {
            errors.push(...validator.errors);
          }
          break;
      }
    }
  }

  return {
    success: errors.length === 0,
    errors: errors
  };
}; 
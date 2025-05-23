import * as Yup from 'yup';
const phoneRegExp = /^\d{10}$/;

class ValidationSchema {
  // Xác thực email với định dạng hợp lệ và yêu cầu bắt buộc
  static email = Yup.string().email('Email không hợp lệ').required('Bắt buộc');
}

class Schemas extends ValidationSchema {
  // Định nghĩa schema cho form đăng ký
  static signupSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Quá ngắn!')
      .max(50, 'Quá dài!')
      .required('Bắt buộc'),
    lastName: Yup.string()
      .min(2, 'Quá ngắn!')
      .max(50, 'Quá dài!')
      .required('Bắt buộc'),
    email: ValidationSchema.email,
    phoneNumber: Yup.string()
      .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
      .required('Bắt buộc'),
    password: Yup.string()
      .min(8, 'Mật khẩu quá ngắn - tối thiểu phải có 8 ký tự.')
      .required('Bắt buộc'),
    confirmPassword: Yup.string().required('Bắt buộc'),
  });
}

export default Schemas;

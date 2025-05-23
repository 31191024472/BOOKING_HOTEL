import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Toast from 'components/ux/toast/Toast';
import { REGISTRATION_MESSAGES } from 'utils/constants';
import { Formik, Form, Field } from 'formik';
import Schemas from 'utils/validation-schemas';

/**
 * Register Component
 * Renders a registration form that allows new users to create an account.
 * It captures user input for personal information and credentials, submitting these to a registration endpoint.
 * Upon successful registration, the user is notified and redirected to the login page.
 */
const Register = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);

  /**
   * Submits the registration form data to the server.
   * It performs an asynchronous operation to post the form data to a registration endpoint.
   * If registration is successful, a success message is displayed, and the user is redirected to the login page after a brief delay.
   * Otherwise, the user is informed of the failure.
   *
   * @param {Object} e - The event object generated by the form submission.
   */
  const handleSubmit = async (values) => {
    try {
      // Log dữ liệu form trước khi gửi
      console.log('Form data being sent:', {
        ...values,
        password: '********', // Ẩn mật khẩu trong log
        confirmPassword: '********'
      });

      // Xác định endpoint dựa trên loại tài khoản
      const endpoint = values.role === 'partner'
        ? 'http://localhost:5000/api/users/register'
        : 'http://localhost:5000/api/users/register';

      console.log('Sending request to endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (response.ok) {
        setToastMessage(REGISTRATION_MESSAGES.SUCCESS);
        setShowToast(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setToastType('error');
        setToastMessage(data.message || "Đăng ký thất bại!");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setToastType('error');
      setToastMessage("Lỗi kết nối đến server.");
      setShowToast(true);
    }
  };

  return (
    <>
      <div className="register__form">
        <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              password: '',
              confirmPassword: '',
              role: 'user', // Thêm giá trị mặc định cho loại tài khoản
            }}
            validationSchema={Schemas.signupSchema}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="w-full max-w-lg p-4 shadow-md md:p-10">
                  <div className="mb-10 text-center">
                    <h2 className="text-3xl font-extrabold text-brand">
                      Tham gia cùng chúng tôi!
                    </h2>
                    <p className="text-gray-500">
                      Tạo tài khoản và bắt đầu hành trình của bạn
                    </p>
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-center space-x-4">
                      <label className="inline-flex items-center">
                        <Field
                          type="radio"
                          name="role"
                          value="user"
                          className="form-radio h-4 w-4 text-brand"
                        />
                        <span className="ml-2">Người dùng</span>
                      </label>
                      <label className="inline-flex items-center">
                        <Field
                          type="radio"
                          name="role"
                          value="partner"
                          className="form-radio h-4 w-4 text-brand"
                        />
                        <span className="ml-2">Đối tác</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-wrap mb-6 -mx-3">
                    <div className="w-full px-3 mb-6 md:w-1/2 md:mb-0 relative">
                      <Field
                        name="firstName"
                        placeholder="Tên"
                        autoComplete="given-name"
                        className={`${errors.firstName && touched.firstName ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                      />
                    </div>
                    <div className="w-full px-3 md:w-1/2">
                      <Field
                        name="lastName"
                        placeholder="Họ"
                        autoComplete="family-name"
                        className={`${errors.lastName && touched.lastName ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <Field
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      className={`${errors.email && touched.email ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                    />
                  </div>
                  <div className="mb-6">
                    <Field
                      name="phone"
                      placeholder="Số điện thoại"
                      autoComplete="tel"
                      className={`${errors.phone && touched.phone ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                    />
                    {errors.phone && touched.phone && (
                      <div className="text-red-500 text-xs mt-1">{errors.phone}</div>
                    )}
                  </div>
                  <div className="mb-6">
                    <Field
                      name="password"
                      placeholder="Mật khẩu"
                      autoComplete="new-password"
                      className={`${errors.password && touched.password ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                    />
                    {errors.password && touched.password && (
                      <div className="text-red-500 text-xs mt-1">{errors.password}</div>
                    )}
                  </div>
                  <div className="mb-6">
                    <Field
                      name="confirmPassword"
                      placeholder="Xác nhận mật khẩu"
                      autoComplete="new-password"
                      className={`${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''} border block w-full px-4 py-3 mb leading-tight text-gray-700 bg-gray-200 rounded appearance-none focus:outline-none focus:bg-white`}
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>
                    )}
                  </div>
                  <div className="flex items-center w-full my-3">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 font-bold text-white rounded bg-brand hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                    >
                      Đăng ký
                    </button>
                  </div>
                  <Link
                    to="/login"
                    className="inline-block w-full text-lg text-center text-gray-500 align-baseline hover:text-blue-800"
                  >
                    Quay lại đăng nhập
                  </Link>
                  {showToast && (
                    <Toast
                      type={toastType}
                      message={toastMessage}
                      dismissError
                    />
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Register;

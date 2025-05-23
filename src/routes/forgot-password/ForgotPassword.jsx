import { useState } from 'react';
import { Link } from 'react-router-dom';
import { networkAdapter } from 'services/NetworkAdapter';
import validations from 'utils/validations';
import Toast from 'components/ux/toast/Toast';

/**
 * Component ForgotPassword chịu trách nhiệm xử lý form quên mật khẩu.
 * @returns {jsx}
 */
const ForgotPassword = () => {
  const [success, setsuccess] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
  });
  const [errorMessage, setErrorMessage] = useState(false);
  /**
   * Xử lý thay đổi input cho các trường của form đăng nhập.
   * Cập nhật state loginData với giá trị của các trường.
   * @param {Object} e - Đối tượng sự kiện từ trường input.
   */
  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const dismissError = () => {
    setErrorMessage('');
  };
  /**
   * Xử lý việc gửi form đăng nhập.
   * Thử xác thực người dùng với thông tin đăng nhập được cung cấp.
   * Chuyển hướng đến trang hồ sơ người dùng khi đăng nhập thành công hoặc hiển thị thông báo lỗi khi thất bại.
   * @param {Object} e - Đối tượng sự kiện từ việc gửi form.
   */
  const handleforgotsubmit = async (e) => {
    e.preventDefault();

    if (validations.validate('email', loginData.email)) {
      const response = await networkAdapter.post('/api/users/forgot-password', loginData);
      if (response) {
        setsuccess(true);
      } else {
        setErrorMessage('Email không hợp lệ.');
      }
    } else {
      setErrorMessage('Email không hợp lệ.');
    }
  };
  return (
    <>
      <div>
        <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
          {success ? (
            <div className="bg-white p-6  md:mx-auto">
              <svg
                viewBox="0 0 24 24"
                className="text-green-600 w-16 h-16 mx-auto my-6"
              >
                <path
                  fill="currentColor"
                  d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                ></path>
              </svg>
              <div className="text-center">
                <h3 className="md:text-2xl text-base text-gray-700 font-semibold text-center">
                  Email khôi phục đã được gửi!
                </h3>
                <p className="text-green-500">
                  {' '}
                  Đừng quên kiểm tra thư mục spam{' '}
                </p>
                <div className="my-6  text-center">
                  <Link
                    to="/"
                    className="px-12 bg-brand hover:bg-indigo-500 text-white font-semibold py-3"
                  >
                    QUAY LẠI
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleforgotsubmit}
              className="w-full max-w-lg p-4 md:p-10 shadow-md"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-brand my-4">
                  Đặt lại mật khẩu
                </h2>
                <div className="mb-6">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={handleInputChange}
                    autoComplete="username"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  />
                  <p className="text-gray-700">
                    Chúng tôi sẽ gửi mã xác thực đến email này nếu nó khớp với một tài khoản hiện có.
                  </p>
                </div>
                {errorMessage && (
                  <Toast
                    type="error"
                    message={errorMessage}
                    dismissError={dismissError}
                  />
                )}
                <div className="flex-wrap items-center justify-between">
                  <button
                    type="submit"
                    className="w-full bg-brand hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Đặt lại mật khẩu
                  </button>
                  <div className="mt-5">
                    <Link
                      to="/login"
                      className="inline-block align-baseline text-lg text-gray-500 hover:text-blue-800 text-right"
                    >
                      Quay lại đăng nhập
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

import React, { useEffect, useState } from 'react';
import FinalBookingSummary from './components/final-booking-summary/FinalBookingSummary';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getReadableMonthFormat } from 'utils/date-helpers';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from 'contexts/AuthContext';
import { useContext } from 'react';
import { networkAdapter } from 'services/NetworkAdapter';
import Loader from 'components/ux/loader/loader';
import Toast from 'components/ux/toast/Toast';

/**
 * Component thanh toán để xử lý thanh toán và thu thập thông tin người dùng.
 *
 * @returns {JSX.Element} Component Checkout đã được render.
 */
const Checkout = () => {
  const [errors, setErrors] = useState({});

  const location = useLocation();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [toastMessage, setToastMessage] = useState('');

  const { isAuthenticated, userDetails } = useContext(AuthContext);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const [paymentConfirmationDetails, setPaymentConfirmationDetails] = useState({
    isLoading: false,
    data: {},
  });

  const dismissToast = () => {
    setToastMessage('');
  };

  // State form để thu thập thông tin thanh toán và địa chỉ của người dùng
  const [formData, setFormData] = useState({
    email: userDetails?.email ? userDetails?.email : '',
    nameOnCard: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });

  // Định dạng ngày giờ check-in và check-out
  const checkInDateTime = `${getReadableMonthFormat(
    searchParams.get('checkIn')
  )}, ${location.state?.checkInTime}`;
  const checkOutDateTime = `${getReadableMonthFormat(
    searchParams.get('checkOut')
  )}, ${location.state?.checkOutTime}`;

  useEffect(() => {
    const locationState = location.state;
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    if (!locationState || !checkIn || !checkOut) {
      const hotelCode = searchParams.get('hotelCode');
      navigate(`/hotel/${hotelCode}`);
    }
  }, [location, navigate, searchParams]);

  /**
   * Xử lý thay đổi input form và validate dữ liệu đầu vào.
   * @param {React.ChangeEvent<HTMLInputElement>} e Sự kiện thay đổi input.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Xử lý đặc biệt cho số thẻ
    if (name === 'cardNumber') {
      // Bỏ tất cả ký tự không phải số và giới hạn 16 số
      const numbersOnly = value.replace(/\D/g, '').slice(0, 16);
      // Thêm dấu cách sau mỗi 4 số
      formattedValue = numbersOnly.replace(/(\d{4})/g, '$1 ').trim();
    }

    const isValid = validationSchema[name](formattedValue);
    setFormData({ ...formData, [name]: formattedValue });
    setErrors({ ...errors, [name]: !isValid });
  };

  /**
   * Xử lý submit form và validate form.
   * @param {React.FormEvent<HTMLFormElement>} e Sự kiện submit form.
   * @returns {void}
   * @todo Thực hiện logic submit form.
   * @todo Thực hiện logic validate form.
   * @todo Thực hiện xử lý lỗi submit form.
   * @todo Thực hiện xử lý thành công submit form.
   * @todo Thực hiện trạng thái loading khi submit form.
   * @todo Thực hiện trạng thái lỗi khi submit form.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      const isFieldValid = validationSchema[field](formData[field]);
      newErrors[field] = !isFieldValid;
      isValid = isValid && isFieldValid;
    });

    setErrors(newErrors);

    if (!isValid) {
      return; // Dừng submit form nếu có lỗi
    }

    setIsSubmitDisabled(true);
    setPaymentConfirmationDetails({
      isLoading: true,
      data: {},
    });

    try {
      // Chuẩn bị dữ liệu đặt phòng
      const bookingData = {
        hotelId: searchParams.get('hotelCode'),
        checkIn: searchParams.get('checkIn'),
        checkOut: searchParams.get('checkOut'),
        guests: parseInt(searchParams.get('guests')),
        roomId: searchParams.get('roomType'),
        totalPrice: parseFloat(searchParams.get('totalPrice')),
        paymentDetails: {
          cardNumber: formData.cardNumber.replace(/\s/g, '').slice(-4),
          cardType: formData.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
          expiryDate: formData.expiry,
          nameOnCard: formData.nameOnCard
        },
        billingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode
        }
      };
      console.log("Check booking data", bookingData)
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      // Gọi API lưu thông tin đặt phòng với token
      const response = await networkAdapter.post('/api/bookings', bookingData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.success) {
        throw new Error(response.message || 'Có lỗi xảy ra khi đặt phòng');
      }

      // Chuyển đến trang thông báo đặt phòng thành công
      const hotelName = searchParams.get('hotelName').replaceAll('-', '_');
      navigate(`/booking-confirmation?payment=success&hotel=${hotelName}`, {
        state: {
          confirmationData: {
            bookingId: response.data.bookingId,
            bookingDate: new Date().toISOString().split('T')[0],
            hotelName: searchParams.get('hotelName').replaceAll('-', ' '),
            checkInDate: searchParams.get('checkIn'),
            checkOutDate: searchParams.get('checkOut'),
            totalFare: searchParams.get('totalPrice')
          }
        }
      });
    } catch (error) {
      console.error('Lỗi khi lưu thông tin đặt phòng:', error);
      setToastMessage(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      setIsSubmitDisabled(false);
      setPaymentConfirmationDetails({
        isLoading: false,
        data: {}
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <FinalBookingSummary
        hotelName={searchParams.get('hotelName').replaceAll('-', ' ')}
        checkIn={checkInDateTime}
        checkOut={checkOutDateTime}
        isAuthenticated={isAuthenticated}
        phone={userDetails?.phone}
        email={userDetails?.email}
        fullName={userDetails?.fullName}
      />
      <div className="relative bg-white border shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg mx-auto">
        {paymentConfirmationDetails.isLoading && (
          <Loader
            isFullScreen={true}
            loaderText={'Đang xử lý thanh toán, vui lòng chờ!'}
          />
        )}
        <form
          onSubmit={handleSubmit}
          className={` ${
            paymentConfirmationDetails.isLoading ? 'opacity-40' : ''
          }`}
        >
          <InputField
            label="Địa chỉ email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required={true}
            error={errors.email}
          />
          <InputField
            label="Tên trên thẻ"
            type="text"
            name="nameOnCard"
            value={formData.nameOnCard}
            onChange={handleChange}
            placeholder="Tên như trên thẻ"
            required={true}
            error={errors.nameOnCard}
          />
          <InputField
            label="Số thẻ"
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="0000 0000 0000 0000"
            required={true}
            error={errors.cardNumber}
            errorMessage={errorMessages.cardNumber}
          />
          <div className="flex mb-4 justify-between">
            <InputField
              label="Ngày hết hạn (MM/YY)"
              type="text"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              placeholder="MM/YY"
              required={true}
              error={errors.expiry}
            />
            <InputField
              label="CVC"
              type="text"
              name="cvc"
              value={formData.cvc}
              onChange={handleChange}
              placeholder="CVC"
              required={true}
              error={errors.cvc}
            />
          </div>
          <InputField
            label="Địa chỉ"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Địa chỉ"
            required={true}
            error={errors.address}
          />
          <InputField
            label="Thành phố"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Thành phố"
            required={true}
            error={errors.city}
          />
          <div className="flex mb-4 justify-between">
            <InputField
              label="Tỉnh / Thành phố"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Tỉnh / Thành phố"
              required={true}
              error={errors.state}
            />
            <InputField
              label="Mã bưu điện"
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Mã bưu điện"
              required={true}
              error={errors.postalCode}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="bg-brand hover:bg-brand-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Thanh toán
            </button>
          </div>
        </form>
      </div>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="error"
          onDismiss={dismissToast}
        />
      )}
    </div>
  );
};

/**
 * Component trường input với label và xử lý lỗi.
 * @param {Object} props - Các props của component.
 * @param {string} props.label - Label của trường input.
 * @param {string} props.type - Loại input.
 * @param {string} props.name - Tên của trường input.
 * @param {string} props.value - Giá trị của trường input.
 * @param {Function} props.onChange - Hàm xử lý sự kiện thay đổi.
 * @param {string} props.placeholder - Placeholder của trường input.
 * @param {boolean} props.required - Trường input có bắt buộc không.
 * @param {boolean} props.error - Trường input có lỗi không.
 * @param {string} props.errorMessage - Thông báo lỗi chi tiết cho trường input.
 * @returns {JSX.Element} Component trường input.
 */
const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
  errorMessage
}) => (
  <div className="mb-4">
    <label
      className="block text-gray-700 text-sm font-bold mb-2"
      htmlFor={name}
    >
      {label}
    </label>
    <input
      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
        error ? 'border-red-500' : ''
      }`}
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
    {error && (
      <p className="text-red-500 text-xs italic">
        {errorMessage || `${label} không hợp lệ`}
      </p>
    )}
  </div>
);

// Validation schema for form fields
const validationSchema = {
  email: (value) => /\S+@\S+\.\S+/.test(value),
  nameOnCard: (value) => value.trim() !== '',
  cardNumber: (value) => {
    // Bỏ tất cả ký tự không phải số
    const numbersOnly = value.replace(/\D/g, '');
    // Kiểm tra độ dài từ 12-16 số
    return numbersOnly.length >= 12 && numbersOnly.length <= 16;
  },
  expiry: (value) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value),
  cvc: (value) => /^\d{3,4}$/.test(value),
  address: (value) => value.trim() !== '',
  city: (value) => value.trim() !== '',
  state: (value) => value.trim() !== '',
  postalCode: (value) => /^\d{5}(-\d{4})?$/.test(value),
};

// Thông báo lỗi chi tiết cho từng trường
const errorMessages = {
  cardNumber: 'Số thẻ phải có từ 12-16 chữ số',
  email: 'Email không hợp lệ',
  nameOnCard: 'Vui lòng nhập tên như trên thẻ',
  expiry: 'Định dạng MM/YY không hợp lệ',
  cvc: 'Mã CVC phải có 3-4 chữ số',
  address: 'Vui lòng nhập địa chỉ',
  city: 'Vui lòng nhập thành phố',
  state: 'Vui lòng nhập tỉnh/thành phố',
  postalCode: 'Mã bưu điện không hợp lệ'
};

export default Checkout;

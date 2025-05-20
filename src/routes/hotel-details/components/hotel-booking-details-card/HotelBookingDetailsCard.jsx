import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { differenceInCalendarDays, isBefore, isAfter, addDays } from 'date-fns';
import DateRangePicker from 'components/ux/data-range-picker/DateRangePicker';
import { networkAdapter } from 'services/NetworkAdapter';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { formatPrice } from 'utils/price-helpers';
import Toast from 'components/ux/toast/Toast';
import format from 'date-fns/format';
import { AuthContext } from 'contexts/AuthContext';
import { useContext } from 'react';

/**
 * Một component hiển thị chi tiết đặt phòng cho khách sạn, bao gồm khoảng thời gian, loại phòng và giá.
 *
 * @param {Object} props - Các props của component.
 * @param {string} props.hotelCode - Mã khách sạn duy nhất.
 */
const HotelBookingDetailsCard = ({ hotelCode }) => {
  // State cho việc hiển thị date picker
  const [isDatePickerVisible, setisDatePickerVisible] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  // State cho thông báo lỗi
  const [errorMessage, setErrorMessage] = useState('');

  // State cho khoảng thời gian
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);

  // State cho phòng, khách và số phòng đã chọn
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedGuests, setSelectedGuests] = useState({
    value: 2,
    label: '2 khách',
  });
  const [selectedRooms, setSelectedRooms] = useState({
    value: 1,
    label: '1 phòng',
  });

  // State cho giá và chi tiết đặt phòng
  const [total, setTotal] = useState(0);
  const [formattedTotal, setFormattedTotal] = useState('0 VND');
  const [bookingPeriodDays, setBookingPeriodDays] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({});

  // State cho validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // State cho loading
  const [isLoading, setIsLoading] = useState(true);

  // Validation functions
  const validateDateRange = (startDate, endDate) => {
    const errors = {};
    
    if (!startDate || !endDate) {
      errors.dateRange = 'Vui lòng chọn ngày nhận phòng và trả phòng';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = addDays(today, 1);
      
      if (isBefore(startDate, tomorrow)) {
        errors.dateRange = 'Ngày nhận phòng phải từ ngày mai trở đi';
      }
      
      if (!isAfter(endDate, startDate)) {
        errors.dateRange = 'Ngày trả phòng phải sau ngày nhận phòng';
      }

      const days = differenceInCalendarDays(endDate, startDate);
      if (days < 1) {
        errors.dateRange = 'Thời gian đặt phòng tối thiểu là 1 ngày';
      }
    }

    return errors;
  };

  const validateRoomSelection = () => {
    const errors = {};
    
    if (!selectedRoom) {
      errors.room = 'Vui lòng chọn loại phòng';
    } else {
      const roomData = bookingDetails.rooms?.find(room => room.roomId === selectedRoom.value);
      if (roomData && roomData.availableRooms < selectedRooms.value) {
        errors.room = `Chỉ còn ${roomData.availableRooms} phòng loại này`;
      }
    }

    return errors;
  };

  const validateGuestSelection = () => {
    const errors = {};
    
    if (!selectedGuests || selectedGuests.value < 1) {
      errors.guests = 'Vui lòng chọn số khách';
    } else {
      const selectedRoomData = bookingDetails.rooms?.find(room => room.roomId === selectedRoom.value);
      if (selectedRoomData && selectedGuests.value > selectedRoomData.maxGuests) {
        errors.guests = `Phòng này chỉ tối đa ${selectedRoomData.maxGuests} khách`;
      }
    }

    return errors;
  };

  // Các tùy chọn cho khách và phòng
  const getGuestOptions = () => {
    if (!selectedRoom || !bookingDetails.rooms) return [];
    
    const selectedRoomData = bookingDetails.rooms.find(room => room.roomId === selectedRoom.value);
    if (!selectedRoomData) return [];

    return Array.from(
      { length: selectedRoomData.maxGuests },
      (_, i) => ({ value: i + 1, label: `${i + 1} khách` })
    );
  };

  const getRoomNumberOptions = () => {
    if (!selectedRoom || !bookingDetails.rooms) return [];
    
    const selectedRoomData = bookingDetails.rooms.find(room => room.roomId === selectedRoom.value);
    if (!selectedRoomData) return [];

    // Chỉ lấy số phòng còn trống, không giới hạn bởi maxRoomsAllowedPerGuest
    return Array.from(
      { length: selectedRoomData.availableRooms },
      (_, i) => ({ value: i + 1, label: `${i + 1} phòng` })
    );
  };

  const roomOptions = bookingDetails.rooms?.map(room => ({
    value: room.roomId,
    label: `${room.roomType} - ${room.roomName} (Còn ${room.availableRooms}/${room.totalRooms} phòng)`
  })) || [];

  // Xử lý thay đổi select
  const handleRoomTypeChange = (selectedOption) => {
    setSelectedRoom(selectedOption);
    // Xóa lỗi room khi thay đổi loại phòng
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.room;
      return newErrors;
    });
    
    // Reset số lượng phòng và khách về giá trị mặc định
    setSelectedRooms({
      value: 1,
      label: '1 phòng'
    });
    
    const selectedRoomData = bookingDetails.rooms?.find(room => room.roomId === selectedOption.value);
    if (selectedRoomData) {
      // Reset số khách về giá trị mặc định của phòng mới
      setSelectedGuests({
        value: 1,
        label: '1 khách'
      });
    }
  };

  const handleGuestsNumberChange = (selectedOption) => {
    const selectedRoomData = bookingDetails.rooms?.find(room => room.roomId === selectedRoom.value);
    if (!selectedRoomData) return;

    // Kiểm tra số khách không vượt quá giới hạn của phòng
    if (selectedOption.value > selectedRoomData.maxGuests) {
      setValidationErrors(prev => ({
        ...prev,
        guests: `Phòng này chỉ tối đa ${selectedRoomData.maxGuests} khách`
      }));
      return;
    }

    setSelectedGuests(selectedOption);
    // Xóa lỗi guests khi thay đổi số khách hợp lệ
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.guests;
      return newErrors;
    });
  };

  const handleRoomsNumberChange = (selectedOption) => {
    const selectedRoomData = bookingDetails.rooms?.find(room => room.roomId === selectedRoom.value);
    if (!selectedRoomData) return;

    // Kiểm tra số phòng không vượt quá số phòng còn trống
    if (selectedOption.value > selectedRoomData.availableRooms) {
      setValidationErrors(prev => ({
        ...prev,
        room: `Chỉ còn ${selectedRoomData.availableRooms} phòng loại này`
      }));
      return;
    }

    setSelectedRooms(selectedOption);
    // Xóa lỗi room khi thay đổi số phòng hợp lệ
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.room;
      return newErrors;
    });
  };

  // Xử lý hiển thị date picker
  const onDatePickerIconClick = () => {
    setisDatePickerVisible(!isDatePickerVisible);
  };

  /**
   * Xử lý thay đổi khoảng thời gian. Cập nhật số ngày đặt phòng và tính toán lại giá.
   *
   * @param {Object} ranges - Khoảng thời gian đã chọn.
   */
  const onDateChangeHandler = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([ranges.selection]);
    
    const dateErrors = validateDateRange(startDate, endDate);
    // Cập nhật validationErrors, xóa lỗi dateRange nếu không có lỗi
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (dateErrors.dateRange) {
        newErrors.dateRange = dateErrors.dateRange;
      } else {
        delete newErrors.dateRange;
      }
      return newErrors;
    });

    if (startDate && endDate) {
      // Tính số ngày chính xác (không cộng thêm 1)
      const days = differenceInCalendarDays(endDate, startDate);
      setBookingPeriodDays(days);
    }
  };

  /**
   * Tính toán tổng giá và thuế dựa trên phòng đã chọn và khoảng thời gian đặt phòng.
   */
  const calculatePrices = () => {
    if (!selectedRoom || !bookingDetails.rooms) return;
    
    const selectedRoomData = bookingDetails.rooms.find(room => room.roomId === selectedRoom.value);
    if (!selectedRoomData) return;

    const pricePerNight = selectedRoomData.price;
    const numberOfRooms = selectedRooms.value;
    const numberOfNights = bookingPeriodDays;
    
    // Tính toán giá mới hoàn toàn
    const totalPrice = pricePerNight * numberOfRooms * numberOfNights;
    
    if (!isNaN(totalPrice)) {
      setTotal(totalPrice);
      setFormattedTotal(`${formatPrice(totalPrice)}`);
    }
  };

  const onBookingConfirm = () => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      setErrorMessage('Hiện bạn chưa đăng nhập để thực hiện chức năng này, đang chuyển qua trang đăng nhập...');
      // Đợi 2 giây trước khi chuyển trang
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            from: `/hotel/${hotelCode}`,
            message: 'Vui lòng đăng nhập để đặt phòng'
          }
        });
      }, 2000);
      return;
    }

    // Validate tất cả các trường
    const dateErrors = validateDateRange(dateRange[0].startDate, dateRange[0].endDate);
    const roomErrors = validateRoomSelection();
    const guestErrors = validateGuestSelection();

    const allErrors = {
      ...dateErrors,
      ...roomErrors,
      ...guestErrors
    };

    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      setErrorMessage('Vui lòng kiểm tra lại thông tin đặt phòng');
      return;
    }

    const checkIn = format(dateRange[0].startDate, 'dd-MM-yyyy');
    const checkOut = format(dateRange[0].endDate, 'dd-MM-yyyy');
    
    // Đảm bảo tất cả dữ liệu cần thiết đều có
    if (!hotelCode || !checkIn || !checkOut || !selectedGuests.value || !selectedRooms.value || !bookingDetails.name) {
      setErrorMessage('Thiếu thông tin đặt phòng. Vui lòng thử lại.');
      return;
    }

    const queryParams = {
      hotelCode,
      checkIn,
      checkOut,
      guests: selectedGuests.value,
      rooms: selectedRooms.value,
      hotelName: bookingDetails.name.replaceAll(' ', '-'),
      roomType: selectedRoom.value,
      totalPrice: total // Gửi giá gốc, chưa format
    };

    const url = `/checkout?${queryString.stringify(queryParams)}`;
    navigate(url, {
      state: {
        total: formattedTotal, // Gửi giá đã format để hiển thị
        checkInTime: bookingDetails.checkInTime,
        checkOutTime: bookingDetails.checkOutTime,
        bookingDetails: {
          hotelName: bookingDetails.name,
          roomType: selectedRoom.label,
          numGuests: selectedGuests.value,
          numRooms: selectedRooms.value,
          checkIn,
          checkOut,
          totalPrice: total // Gửi giá gốc, chưa format
        }
      },
      replace: true
    });
  };

  // Xử lý đóng thông báo lỗi
  const dismissError = () => {
    setErrorMessage('');
    setValidationErrors({});
  };

  // Effect cho việc lấy chi tiết đặt phòng
  useEffect(() => {
    const getBookingDetails = async () => {
      try {
        setIsLoading(true);
        const response = await networkAdapter.get(
          `api/hotels/${hotelCode}/booking/enquiry`
        );
        
        if (response && response.data) {
          setBookingDetails(response.data);
          // Tự động chọn phòng đầu tiên nếu có
          if (response.data.rooms && response.data.rooms.length > 0) {
            const firstRoom = response.data.rooms[0];
            setSelectedRoom({
              value: firstRoom.roomId,
              label: `${firstRoom.roomType} - ${firstRoom.roomName} (Còn ${firstRoom.availableRooms}/${firstRoom.totalRooms} phòng)`
            });
          }
        } else {
          setErrorMessage("Không thể tải thông tin đặt phòng. Vui lòng thử lại sau.");
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setErrorMessage("Lỗi kết nối đến server. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    getBookingDetails();
  }, [hotelCode]);

  // Effect để tính lại giá khi có thay đổi
  useEffect(() => {
    if (selectedRoom && bookingDetails.rooms) {
      calculatePrices();
    }
  }, [selectedRoom, selectedRooms.value, selectedGuests.value, bookingPeriodDays, bookingDetails]);

  if (isLoading) {
    return <div>Đang tải thông tin...</div>;
  }

  return (
    <div className="mx-2 bg-white shadow-xl rounded-xl overflow-hidden mt-2 md:mt-0 w-full md:w-[380px]">
      <div className="px-6 py-4 bg-brand text-white">
        <h2 className="text-xl font-bold">Chi tiết đặt phòng</h2>
      </div>
      <div className="p-6 text-sm md:text-base">
        {/* Tổng giá */}
        <div className="mb-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">
            Tổng giá
          </div>
          <div className="text-xl font-bold text-indigo-600">{formattedTotal}</div>
          {selectedRoom && bookingDetails.rooms && (
            <div className="text-sm text-gray-600 mt-1">
              {formatPrice(bookingDetails.rooms.find(room => room.roomId === selectedRoom.value)?.price || 0)}/đêm × {selectedRooms.value} phòng × {bookingPeriodDays} đêm
            </div>
          )}
          <div className="text-sm text-green-600 mt-1">
            {bookingDetails.cancellationPolicy}
          </div>
        </div>

        {/* Ngày giờ */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Ngày giờ</div>
          <div className="text-gray-600">
            <DateRangePicker
              isDatePickerVisible={isDatePickerVisible}
              onDatePickerIconClick={onDatePickerIconClick}
              onDateChangeHandler={onDateChangeHandler}
              setisDatePickerVisible={setisDatePickerVisible}
              dateRange={dateRange}
              inputStyle="DARK"
            />
            <div className="mt-2 text-sm text-gray-500">
              Nhận phòng: {bookingDetails.checkInTime} | Trả phòng: {bookingDetails.checkOutTime}
            </div>
            {validationErrors.dateRange && (
              <div className="mt-1 text-sm text-red-500">{validationErrors.dateRange}</div>
            )}
          </div>
        </div>

        {/* Đặt phòng */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Đặt phòng</div>
          <Select
            value={selectedRooms}
            onChange={handleRoomsNumberChange}
            options={getRoomNumberOptions()}
            className="mb-2"
          />
          <Select
            value={selectedGuests}
            onChange={handleGuestsNumberChange}
            options={getGuestOptions()}
          />
          {validationErrors.guests && (
            <div className="mt-1 text-sm text-red-500">{validationErrors.guests}</div>
          )}
        </div>

        {/* Loại phòng */}
        <div className="mb-4">
          <div className="font-semibold text-gray-800">Loại phòng</div>
          <Select
            value={selectedRoom}
            onChange={handleRoomTypeChange}
            options={roomOptions}
            placeholder="Chọn loại phòng"
          />
          {selectedRoom && bookingDetails.rooms && (
            <div className="mt-2 text-sm text-gray-600">
              {bookingDetails.rooms.find(room => room.roomId === selectedRoom.value)?.roomName}
              <br />
              Tối đa {bookingDetails.rooms.find(room => room.roomId === selectedRoom.value)?.maxGuests} khách/phòng
            </div>
          )}
          {validationErrors.room && (
            <div className="mt-1 text-sm text-red-500">{validationErrors.room}</div>
          )}
        </div>

        {errorMessage && (
          <Toast
            type="error"
            message={errorMessage}
            dismissError={dismissError}
          />
        )}
      </div>
      <div className="px-6 py-4 bg-gray-50">
        <button
          onClick={onBookingConfirm}
          className="w-full bg-brand-secondary text-white py-2 rounded hover:bg-yellow-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            !selectedRoom || 
            !dateRange[0].startDate || 
            !dateRange[0].endDate || 
            Object.keys(validationErrors).length > 0
          }
        >
          Xác nhận đặt phòng
        </button>
      </div>
    </div>
  );
};

export default HotelBookingDetailsCard;

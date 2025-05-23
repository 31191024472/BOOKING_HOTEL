import React from 'react';
import { differenceInCalendarDays } from 'date-fns';

/**
 * Component hiển thị tổng quan đặt phòng cuối cùng.
 * @param {Object} props Các props của component.
 * @param {string} props.hotelName Tên khách sạn.
 * @param {string} props.checkIn Ngày check-in.
 * @param {string} props.checkOut Ngày check-out.
 * @param {boolean} props.isAuthenticated Trạng thái xác thực người dùng.
 * @param {string} props.phone Số điện thoại người dùng.
 * @param {string} props.email Email người dùng.
 * @param {string} props.fullName Họ tên đầy đủ người dùng.
 *
 * @returns {JSX.Element} Component FinalBookingSummary đã được render.
 */
const FinalBookingSummary = ({
  hotelName,
  checkIn,
  checkOut,
  isAuthenticated,
  phone,
  email,
  fullName,
}) => {
  const numNights = differenceInCalendarDays(
    new Date(checkOut),
    new Date(checkIn)
  );
  return (
    <div className="bg-white border-gray-200 border rounded-lg p-6 mb-6 shadow w-full max-w-lg mx-auto mt-4">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-800">{hotelName}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-3">
          <div>
            <p className="text-sm font-semibold text-gray-600">Check-in</p>
            <p className="text-sm text-gray-800">{checkIn}</p>
          </div>
          <div>
            <p className="text-sm text-gray-800 inline-flex py-1 px-5 rounded-2xl border">
              {numNights} Đêm
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">Check-out</p>
            <p className="text-sm text-gray-800">{checkOut}</p>
          </div>
        </div>
      </div>
      {isAuthenticated && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm font-semibold text-gray-600">
            Chi tiết đặt phòng sẽ được gửi đến:
          </p>
          <p className="text-sm text-gray-800">{fullName} (Chính)</p>
          <p className="text-sm text-gray-800">{email}</p>
          <p className="text-sm text-gray-800">{phone}</p>
        </div>
      )}
    </div>
  );
};

export default FinalBookingSummary;

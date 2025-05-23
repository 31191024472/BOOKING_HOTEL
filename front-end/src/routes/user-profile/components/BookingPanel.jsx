const BookingPanel = ({ bookings }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {bookings.map((booking, index) => (
          <li key={index} className="bg-white hover:bg-gray-50">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-brand truncate">
                  Booking ID: {booking.bookingId}
                </p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {booking.status}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex gap-x-2">
                  <p className="flex items-center text-sm text-gray-500">
                    <svg
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-4 4V3m0 4v8m-4-4h8"
                      />
                    </svg>
                    Ngày đặt: {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                  <p className="flex items-center text-sm text-gray-500">
                    <svg
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 10l5 5 5-5m-5 5V3"
                      />
                    </svg>
                    Check-in: {new Date(booking.checkIn).toLocaleDateString('vi-VN')}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    <svg
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 10l5 5 5-5m-5 5V3"
                      />
                    </svg>
                    Check-out: {new Date(booking.checkOut).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p className="flex items-center">
                    <span className="font-medium">Tổng tiền: </span>{' '}
                    <span className="ml-2">{booking.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Chi tiết: </span>
                  {booking.rooms} phòng - {booking.guests} khách - {booking.roomType}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingPanel;

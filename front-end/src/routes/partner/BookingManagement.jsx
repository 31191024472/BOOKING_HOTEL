import { useState, useEffect } from 'react';
import { networkAdapter } from 'services/NetworkAdapter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      fetchBookings(selectedHotel);
    }
  }, [selectedHotel, filter]);

  const fetchHotels = async () => {
    try {
      const response = await networkAdapter.get('api/partner/hotels');
      if (response.success) {
        setHotels(response.data);
        if (response.data.length > 0) {
          setSelectedHotel(response.data[0].hotelCode);
        }
      }
    } catch (err) {
      setError('Không thể tải danh sách khách sạn');
    }
  };

  const fetchBookings = async (hotelId) => {
    setLoading(true);
    try {
      const response = await networkAdapter.get(`api/partner/hotels/${hotelId}/bookings`);
      if (response.success) {
        let filteredBookings = response.data;
        if (filter !== 'all') {
          filteredBookings = response.data.filter(booking =>
            booking.status.toLowerCase() === filter.toLowerCase()
          );
        }
        setBookings(filteredBookings);
      } else {
        setError('Không thể tải danh sách đặt phòng');
        setBookings([]);
      }
    } catch (err) {
      setError('Lỗi kết nối server');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await networkAdapter.put(`api/partner/bookings/${bookingId}/status`, {
        status: newStatus
      });
      if (response.success) {
        fetchBookings(selectedHotel);
      } else {
        setError(response.message || 'Không thể cập nhật trạng thái');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý đặt phòng</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {hotels.map((hotel) => (
              <option key={hotel.hotelCode} value={hotel.hotelCode}>
                {hotel.title}
              </option>
            ))}
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đặt phòng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày nhận/trả phòng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số phòng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số khách
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking._id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.userId?.email || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.rooms}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.guests}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(booking.totalPrice)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {booking.status === 'Confirmed' ? 'Đã xác nhận' :
                      booking.status === 'Pending' ? 'Chờ xác nhận' :
                        'Đã hủy'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {booking.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(booking._id, 'Confirmed')}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Xác nhận
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking._id, 'Cancelled')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hủy
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowDetailModal(true);
                    }}
                    className="text-brand hover:text-blue-600 ml-3"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết đặt phòng */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Chi tiết đặt phòng</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Mã đặt phòng</p>
                  <p className="text-sm text-gray-600">{selectedBooking._id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Ngày đặt</p>
                  <p className="text-sm text-gray-600">{formatDate(selectedBooking.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Trạng thái</p>
                  <p className={`text-sm ${selectedBooking.status === 'Confirmed' ? 'text-green-600' :
                    selectedBooking.status === 'Pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                    {selectedBooking.status === 'Confirmed' ? 'Đã xác nhận' :
                      selectedBooking.status === 'Pending' ? 'Chờ xác nhận' :
                        'Đã hủy'}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Thông tin khách hàng</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-600">{selectedBooking.userId?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Thông tin đặt phòng</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Check-in</p>
                    <p className="text-sm text-gray-600">{formatDate(selectedBooking.checkIn)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Check-out</p>
                    <p className="text-sm text-gray-600">{formatDate(selectedBooking.checkOut)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Số phòng</p>
                    <p className="text-sm text-gray-600">{selectedBooking.rooms}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Số khách</p>
                    <p className="text-sm text-gray-600">{selectedBooking.guests}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tổng tiền</p>
                    <p className="text-sm text-gray-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(selectedBooking.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement; 
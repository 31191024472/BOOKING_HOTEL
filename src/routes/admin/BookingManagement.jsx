import axios from 'axios';
import { useEffect, useState } from 'react';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/admin/bookings'
        );
        setBookings(response.data.bookings);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bookings', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/bookings/${id}`,
        { status }
      );

      const updatedBookings = bookings.map((booking) =>
        booking._id === id
          ? { ...booking, status: response.data.booking.status }
          : booking
      );
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái booking', error);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá booking này?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/bookings/${id}`);
      const updatedBookings = bookings.filter((booking) => booking._id !== id);
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Lỗi khi xoá booking', error);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Quản lý Bookings</h2>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : bookings.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Thời gian nhận phòng</th>
              <th className="border p-2">Khách sạn</th>
              <th className="border p-2">Loại phòng</th>
              <th className="border p-2">Số phòng</th>
              <th className="border p-2">Tổng tiền</th>
              <th className="border p-2">Trạng thái</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border">
                <td className="p-2">
                  {new Date(booking.checkIn).toLocaleDateString()}
                </td>
                <td className="p-2">{booking.hotelTitle || 'N/A'}</td>
                <td className="p-2">{booking.roomType || 'N/A'}</td>
                <td className="p-2">{booking.rooms}</td>
                <td className="p-2">
                  {booking.totalPrice.toLocaleString()} VND
                </td>
                <td className="p-2">
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      handleStatusChange(booking._id, e.target.value)
                    }
                    className="border p-1 rounded"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDeleteBooking(booking._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có booking nào.</p>
      )}
    </div>
  );
};

export default BookingManagement;

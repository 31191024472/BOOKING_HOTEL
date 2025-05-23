import axios from 'axios';
import { useEffect, useState } from 'react';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState({
    hotelId: '',
    roomType: 'Standard',
    description: '',
    pricePerNight: 0,
    maxOccupancy: 2,
    bedType: '',
    amenities: '',
    totalRooms: 1,
    availableRooms: 1,
    isActive: true,
    discount: 0,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editingRoomId, setEditingRoomId] = useState(null); // ID của phòng đang chỉnh sửa

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/admin/rooms'
        );
        setRooms(response.data.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleCreateOrUpdateRoom = async () => {
    const formData = new FormData();
    Object.keys(newRoom).forEach((key) => {
      if (key === 'amenities') {
        formData.append(key, newRoom[key].split(','));
      } else {
        formData.append(key, newRoom[key]);
      }
    });
    selectedFiles.forEach((file) => formData.append('images', file));

    try {
      if (editingRoomId) {
        await axios.put(
          `http://localhost:5000/api/admin/rooms/${editingRoomId}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        alert('Phòng đã được cập nhật!');
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/admin/rooms',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        setRooms([...rooms, response.data.data]);
        alert('Phòng đã được tạo!');
      }
      resetForm(); // Reset form sau khi cập nhật hoặc thêm phòng
    } catch (error) {
      console.error('Lỗi khi lưu phòng', error);
    }
  };

  const handleEditRoom = (room) => {
    setNewRoom({
      hotelId: room.hotelId,
      roomType: room.roomType,
      description: room.description,
      pricePerNight: room.pricePerNight,
      maxOccupancy: room.maxOccupancy,
      bedType: room.bedType,
      amenities: room.amenities.join(','), // Chuyển array thành chuỗi
      totalRooms: room.totalRooms,
      availableRooms: room.availableRooms,
      isActive: room.isActive,
      discount: room.discount.percentage,
    });
    setEditingRoomId(room._id);
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phòng này không?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/rooms/${roomId}`);
      setRooms(rooms.filter((room) => room._id !== roomId));
      alert('Phòng đã bị xóa!');
    } catch (error) {
      console.error('Lỗi khi xóa phòng', error);
    }
  };

  const resetForm = () => {
    setNewRoom({
      hotelId: '',
      roomType: 'Standard',
      description: '',
      pricePerNight: 0,
      maxOccupancy: 2,
      bedType: '',
      amenities: '',
      totalRooms: 1,
      availableRooms: 1,
      isActive: true,
      discount: 0,
    });
    setSelectedFiles([]);
    setEditingRoomId(null);
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Quản lý Phòng</h2>

      {/* Form thêm/sửa phòng */}
      <form className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="ID Khách sạn"
          value={newRoom.hotelId}
          onChange={(e) => setNewRoom({ ...newRoom, hotelId: e.target.value })}
          className="border p-2 block w-full"
        />

        <select
          value={newRoom.roomType}
          onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
          className="border p-2 block w-full"
        >
          <option value="Standard">Standard</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Suite">Suite</option>
          <option value="Executive">Executive</option>
        </select>

        <textarea
          placeholder="Mô tả"
          value={newRoom.description}
          onChange={(e) =>
            setNewRoom({ ...newRoom, description: e.target.value })
          }
          className="border p-2 block w-full"
        />

        <input
          type="number"
          placeholder="Giá mỗi đêm"
          value={newRoom.pricePerNight}
          onChange={(e) =>
            setNewRoom({ ...newRoom, pricePerNight: e.target.value })
          }
          className="border p-2 block w-full"
        />

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="border p-2 block w-full"
        />

        <label>
          Giảm giá (%)
          <input
            type="number"
            value={newRoom.discount}
            onChange={(e) =>
              setNewRoom({ ...newRoom, discount: e.target.value })
            }
            className="border p-2 block w-full"
          />
        </label>

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleCreateOrUpdateRoom}
            className={`px-4 py-2 rounded text-white ${editingRoomId ? 'bg-green-500' : 'bg-blue-500'}`}
          >
            {editingRoomId ? 'Cập nhật phòng' : 'Thêm phòng'}
          </button>

          {editingRoomId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* Danh sách phòng */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : rooms.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Loại phòng</th>
              <th className="border p-2">Giá</th>
              <th className="border p-2">Giảm giá</th>
              <th className="border p-2">Hình ảnh</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id} className="border">
                <td className="p-2">{room.roomType}</td>
                <td className="p-2">{room.pricePerNight} VND</td>
                <td className="p-2">{room.discount.percentage}%</td>
                <td className="p-2 flex space-x-2">
                  {room.imageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="room"
                      className="w-16 h-16 object-cover"
                    />
                  ))}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditRoom(room)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có phòng nào.</p>
      )}
    </div>
  );
};

export default RoomManagement;

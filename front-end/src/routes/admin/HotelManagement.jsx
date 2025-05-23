import axios from 'axios';
import { useEffect, useState } from 'react';

const PROPERTY_TYPES = ['Hotel', 'Resort', 'Homestay', 'Villa', 'Apartment'];

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null); // Chọn khách sạn để sửa
  const [newHotel, setNewHotel] = useState({
    hotelCode: '',
    title: '',
    propertyType: 'Hotel',
    cityId: '',
    benefits: '',
    images: [],
  });

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/admin/hotels'
        );
        setHotels(response.data.hotels);
        //console.log('Danh sách khách sạn:', response);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khách sạn', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleFileChange = (e) => {
    setNewHotel({ ...newHotel, images: e.target.files });
  };

  const handleCreateHotel = async () => {
    const formData = new FormData();
    formData.append('hotelCode', newHotel.hotelCode);
    formData.append('title', newHotel.title);
    formData.append('propertyType', newHotel.propertyType);
    formData.append('cityId', newHotel.cityId);
    formData.append('benefits', newHotel.benefits);
    Array.from(newHotel.images).forEach((file) =>
      formData.append('images', file)
    );

    try {
      const response = await axios.post(
        'http://localhost:5000/api/admin/hotels',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setHotels([...hotels, response.data.data]);
      alert('Khách sạn được tạo thành công!');
    } catch (error) {
      console.error('Lỗi tạo khách sạn:', error);
    }
  };

  const handleEditHotel = async () => {
    if (!selectedHotel) return;

    const formData = new FormData();
    formData.append('hotelCode', selectedHotel.hotelCode);
    formData.append('title', selectedHotel.title);
    formData.append('propertyType', selectedHotel.propertyType);
    formData.append('cityId', selectedHotel.cityId);
    formData.append('benefits', selectedHotel.benefits);
    Array.from(selectedHotel.images || []).forEach((file) =>
      formData.append('images', file)
    );

    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/hotels/${selectedHotel._id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setHotels(
        hotels.map((hotel) =>
          hotel._id === selectedHotel._id ? response.data.data : hotel
        )
      );
      setSelectedHotel(null);
      alert('Khách sạn được cập nhật thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật khách sạn:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/hotels/${id}`);
      setHotels(hotels.filter((hotel) => hotel._id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa khách sạn', error);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Quản lý Khách sạn</h2>

      {/* Form thêm/sửa khách sạn */}
      <form className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Mã khách sạn"
          value={selectedHotel?.hotelCode || newHotel.hotelCode}
          onChange={(e) =>
            selectedHotel
              ? setSelectedHotel({
                  ...selectedHotel,
                  hotelCode: e.target.value,
                })
              : setNewHotel({ ...newHotel, hotelCode: e.target.value })
          }
          className="border p-2 block w-full"
        />
        <input
          type="text"
          placeholder="Tên khách sạn"
          value={selectedHotel?.title || newHotel.title}
          onChange={(e) =>
            selectedHotel
              ? setSelectedHotel({ ...selectedHotel, title: e.target.value })
              : setNewHotel({ ...newHotel, title: e.target.value })
          }
          className="border p-2 block w-full"
        />

        {/* Chọn loại hình khách sạn */}
        <select
          value={selectedHotel?.propertyType || newHotel.propertyType}
          onChange={(e) =>
            selectedHotel
              ? setSelectedHotel({
                  ...selectedHotel,
                  propertyType: e.target.value,
                })
              : setNewHotel({ ...newHotel, propertyType: e.target.value })
          }
          className="border p-2 block w-full"
        >
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Thành phố (ID)"
          value={selectedHotel?.cityId || newHotel.cityId}
          onChange={(e) =>
            selectedHotel
              ? setSelectedHotel({ ...selectedHotel, cityId: e.target.value })
              : setNewHotel({ ...newHotel, cityId: e.target.value })
          }
          className="border p-2 block w-full"
        />
        <input
          type="text"
          placeholder="Lợi ích (cách nhau bằng dấu phẩy)"
          value={selectedHotel?.benefits || newHotel.benefits}
          onChange={(e) =>
            selectedHotel
              ? setSelectedHotel({ ...selectedHotel, benefits: e.target.value })
              : setNewHotel({ ...newHotel, benefits: e.target.value })
          }
          className="border p-2 block w-full"
        />
        <input
          type="file"
          multiple
          onChange={(e) =>
            selectedHotel
              ? setSelectedHotel({ ...selectedHotel, images: e.target.files })
              : setNewHotel({ ...newHotel, images: e.target.files })
          }
          className="border p-2 block w-full"
        />
        <button
          type="button"
          onClick={selectedHotel ? handleEditHotel : handleCreateHotel}
          className={`px-4 py-2 rounded ${selectedHotel ? 'bg-yellow-500' : 'bg-blue-500'} text-white`}
        >
          {selectedHotel ? 'Cập nhật khách sạn' : 'Thêm khách sạn'}
        </button>
        {selectedHotel && (
          <button
            type="button"
            onClick={() => setSelectedHotel(null)}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Hủy
          </button>
        )}
      </form>

      {/* Danh sách khách sạn */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : hotels?.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Ảnh</th>
              <th className="border p-2">Tên khách sạn</th>
              <th className="border p-2">Loại hình</th>
              <th className="border p-2">Đánh giá</th>
              <th className="border p-2">Thành phố</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel._id} className="border">
                <td className="p-2">
                  {hotel.imageUrls?.length > 0 ? (
                    <img
                      src={hotel.imageUrls[0]}
                      alt={hotel.title}
                      className="w-20 h-20 object-cover"
                    />
                  ) : (
                    'Không có ảnh'
                  )}
                </td>
                <td className="p-2">{hotel.title}</td>
                <td className="p-2">{hotel.propertyType}</td>
                <td className="p-2">{hotel.ratings || 'N/A'} ⭐</td>
                <td className="p-2">{hotel.cityId?.name || 'N/A'}</td>
                <td className="p-2">
                  <button
                    onClick={() => setSelectedHotel(hotel)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(hotel._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có khách sạn nào.</p>
      )}
    </div>
  );
};

export default HotelManagement;

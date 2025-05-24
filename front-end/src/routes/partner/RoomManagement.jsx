import { useState, useEffect } from 'react';
import { networkAdapter } from 'services/NetworkAdapter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomType: '',
    description: '',
    pricePerNight: '',
    maxOccupancy: '',
    bedType: '',
    amenities: [],
    totalRooms: '',
    availableRooms: '',
    imageUrls: [],
    isActive: true,
    discount: 0,
  });


  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      fetchRooms(selectedHotel);
    }
  }, [selectedHotel]);

  const fetchHotels = async () => {
    try {
      setLoadingHotels(true);
      const response = await networkAdapter.get('/api/partner/hotels');
      console.log('Hotels response:', response); // Debug log
      if (response.success) {
        setHotels(response.data);
        if (response.data.length > 0) {
          setSelectedHotel(response.data[0].id);
        }
      } else {
        setError('Không thể tải danh sách khách sạn');
        toast.error('Không thể tải danh sách khách sạn');
      }
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError('Không thể tải danh sách khách sạn');
      toast.error('Không thể tải danh sách khách sạn');
    } finally {
      setLoadingHotels(false);
    }
  };

  const fetchRooms = async (hotelId) => {
    setLoading(true);
    try {
      const response = await networkAdapter.get(`/api/partner/hotels/${hotelId}/rooms`);
      console.log('Rooms response:', response); // Debug log
      if (response.success) {
        setRooms(response.data || []);
      } else {
        setError('Không thể tải danh sách phòng');
        toast.error('Không thể tải danh sách phòng');
        setRooms([]);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Lỗi kết nối server');
      toast.error('Lỗi kết nối server');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = async (e) => {
    // Lấy danh sách file từ input
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Tạo FormData để gửi file
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      setUploadingImages(true);
      console.log('Files to upload:', files);
      // Gọi API upload ảnh trực tiếp bằng fetch
      const response = await fetch('http://localhost:5000/api/upload/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      console.log("Upload response:", data);

      if (data.success) {
        // Nếu upload thành công, thêm URL ảnh vào formData
        setFormData(prev => {
          const newFormData = {
            ...prev,
            imageUrls: [...prev.imageUrls, ...data.data.urls]
          };
          console.log('Updated formData:', newFormData);
          return newFormData;
        });
        toast.success('Tải lên hình ảnh thành công');
      } else {
        toast.error(data.message || 'Không thể tải lên hình ảnh');
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      toast.error('Không thể tải lên hình ảnh');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const roomData = {
        ...formData,
        hotelId: selectedHotel,
        discount: { percentage: Number(formData.discount) || 0 },
        imageUrls: formData.imageUrls || []
      };
      console.log('Current formData:', formData); // Debug log
      console.log('Sending room data:', roomData); // Debug log

      const response = await networkAdapter.post(`/api/partner/hotels/${selectedHotel}/rooms`, roomData);
      console.log('Submit response:', response); // Debug log

      if (response.success) {
        toast.success('Thêm phòng thành công');
        setShowAddModal(false);
        fetchRooms(selectedHotel);
        resetForm();
      } else {
        setError(response.message || 'Không thể tạo phòng mới');
        toast.error(response.message || 'Không thể tạo phòng mới');
      }
    } catch (err) {
      console.error('Error creating room:', err);
      setError('Lỗi kết nối server');
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const roomData = {
        ...formData,
        hotelId: selectedHotel
      };
      console.log('Sending update room data:', roomData); // Debug log

      const response = await networkAdapter.put(`/api/partner/rooms/${selectedRoom._id}`, roomData);
      if (response.success) {
        toast.success('Cập nhật phòng thành công');
        setShowEditModal(false);
        fetchRooms(selectedHotel);
        resetForm();
      } else {
        setError(response.message || 'Không thể cập nhật phòng');
        toast.error(response.message || 'Không thể cập nhật phòng');
      }
    } catch (err) {
      console.error('Error updating room:', err);
      setError('Lỗi kết nối server');
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      try {
        const response = await networkAdapter.delete(`api/partner/rooms/${roomId}`);
        if (response.success) {
          fetchRooms(selectedHotel);
        } else {
          setError(response.message || 'Không thể xóa phòng');
        }
      } catch (err) {
        setError('Lỗi kết nối server');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      roomType: '',
      description: '',
      pricePerNight: '',
      maxOccupancy: '',
      bedType: '',
      amenities: [],
      totalRooms: '',
      availableRooms: '',
      imageUrls: [],
      isActive: true,
      discount: 0
    });
    setSelectedRoom(null);
    console.log('Form reset:', formData); // Debug log
  };
  // Thêm hàm helper để xác định trạng thái phòng
  const getRoomStatus = (availableRooms) => {
    if (availableRooms > 0) {
      return {
        text: `Còn ${availableRooms} phòng`,
        className: 'bg-green-100 text-green-800'
      };
    } else {
      return {
        text: 'Hết phòng',
        className: 'bg-red-100 text-red-800'
      };
    }
  };
  // Hàm lấy tên khách sạn
  const getHotelName = (hotelId) => {
    const hotel = hotels.find(h => h.id === hotelId);
    return hotel ? hotel.title : 'Khách sạn không xác định';
  };

  const renderRoomCard = (room) => {
    // Kiểm tra room có tồn tại không
    if (!room) return null;

    return (
      <div key={room._id || room.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative h-48">
          <img
            src={room.imageUrls?.[0] || '/placeholder-room.jpg'}
            alt={room?.roomType || 'Phòng'}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 shadow-sm">
            {room.maxOccupancy || room.capacity || 0} người
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-lg font-semibold text-white">{room.description || room.name || 'Không có mô tả'}</h3>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-600 text-sm mb-2">
            {getHotelName(room.hotelId)}
          </p>
          <p className="text-gray-600 text-sm mb-2">{room.roomType || room.roomType || 'Không xác định'}</p>
          <p className="text-gray-600 text-sm mb-4">
            {(room.pricePerNight || room.price || 0).toLocaleString('vi-VN')} VNĐ/đêm
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {(room.amenities || []).slice(0, 3).map((amenity, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {amenity}
              </span>
            ))}
            {room.amenities?.length > 3 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                +{room.amenities.length - 3}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-xs ${getRoomStatus(room.availableRooms || 0).className}`}>
              {getRoomStatus(room.availableRooms || 0).text}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setSelectedRoom(room);
                  setFormData({
                    roomType: room.roomType || '',
                    description: room.description || '',
                    pricePerNight: room.pricePerNight || '',
                    maxOccupancy: room.maxOccupancy || '',
                    bedType: room.bedType || '',
                    amenities: room.amenities || [],
                    totalRooms: room.totalRooms || '',
                    availableRooms: room.availableRooms || '',
                    imageUrls: room.imageUrls || [],
                    isActive: room.isActive !== false,
                    discount: room.discount?.percentage || 0,
                  });
                  setShowEditModal(true);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                onClick={() => handleDelete(room._id || room.id)}
                className="text-red-600 hover:text-red-800"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý phòng</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className="border rounded px-3 py-2"
            disabled={loadingHotels}
          >
            <option value="">-- Chọn khách sạn --</option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center transition-colors duration-200"
            disabled={!selectedHotel}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Thêm phòng mới
          </button>
        </div>
      </div>

      {loadingHotels ? (
        <div className="flex justify-center items-center h-64">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-500" />
          <span className="ml-2">Đang tải danh sách khách sạn...</span>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-500" />
          <span className="ml-2">Đang tải danh sách phòng...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms && rooms.length > 0 ? (
            rooms.map(renderRoomCard)
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              Chưa có phòng nào. Hãy thêm phòng mới!
            </div>
          )}
        </div>
      )}

      {/* Modal thêm phòng */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Thêm phòng mới</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên phòng
                  </label>
                  <input
                    type="text"
                    name="bedType"
                    value={formData.bedType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại phòng
                  </label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value={formData.roomType}>{formData.roomType}</option>
                    <option value="">Chọn loại phòng</option>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá phòng (VNĐ/đêm)
                  </label>
                  <input
                    type="number"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sức chứa
                  </label>
                  <input
                    type="number"
                    name="maxOccupancy"
                    value={formData.maxOccupancy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tổng số phòng
                  </label>
                  <input
                    type="number"
                    name="totalRooms"
                    value={formData.totalRooms}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số phòng còn trống
                  </label>
                  <input
                    type="number"
                    name="availableRooms"
                    value={formData.availableRooms}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="available">Còn trống</option>
                    <option value="booked">Đã đặt</option>
                    <option value="unavailable">Không khả dụng</option>
                  </select>
                </div> */}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  rows="4"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiện ích
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Wifi', 'TV', 'Mini bar', 'Điều hòa', 'Bồn tắm', 'Tủ lạnh'].map(amenity => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="mr-2"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình ảnh
                </label>
                <div className="mt-1">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                    disabled={uploadingImages}
                  />
                  {uploadingImages && (
                    <div className="mt-2 flex items-center text-sm text-blue-600">
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      Đang tải lên hình ảnh...
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {formData.imageUrls.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Room ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            imageUrls: prev.imageUrls.filter((_, i) => i !== index)
                          }));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        disabled={uploadingImages}
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Thêm phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa phòng */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Chỉnh sửa phòng</h3>
            <form onSubmit={handleEdit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên phòng
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.bedType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại phòng
                  </label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Chọn loại phòng</option>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá phòng (VNĐ/đêm)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sức chứa
                  </label>
                  <input
                    type="number"
                    name="maxOccupancy"
                    value={formData.maxOccupancy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tổng số phòng
                  </label>
                  <input
                    type="number"
                    name="totalRooms"
                    value={formData.totalRooms}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số phòng còn trống
                  </label>
                  <input
                    type="number"
                    name="availableRooms"
                    value={formData.availableRooms}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="available">Còn trống</option>
                    <option value="booked">Đã đặt</option>
                    <option value="unavailable">Không khả dụng</option>
                  </select>
                </div> */}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  rows="4"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiện ích
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Wifi', 'TV', 'Mini bar', 'Điều hòa', 'Bồn tắm', 'Tủ lạnh'].map(amenity => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="mr-2"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình ảnh
                </label>
                <div className="mt-1">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                    disabled={uploadingImages}
                  />
                  {uploadingImages && (
                    <div className="mt-2 flex items-center text-sm text-blue-600">
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      Đang tải lên hình ảnh...
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {formData.imageUrls.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Room ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            imageUrls: prev.imageUrls.filter((_, i) => i !== index)
                          }));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        disabled={uploadingImages}
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Cập nhật phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement; 
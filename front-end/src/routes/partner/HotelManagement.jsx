import React, { useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { networkAdapter } from '../../services/NetworkAdapter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const HotelManagement = () => {
  const { userDetails, isAuthenticated } = React.useContext(AuthContext);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    hotelCode: '',
    title: '',
    subtitle: '',
    description: '',
    cityId: '',
    propertyType: 'Hotel',
    benefits: [],
    ratings: 5,
    imageUrls: [],
    status: 'Chưa xét duyệt',
    address: 'Chưa Cập Nhật'
  });

  const benefitsList = [
    'Free Wifi',
    'Hồ bơi',
    'Bữa sáng miễn phí',
    'Phòng gym',
    'Spa',
    'Nhà hàng',
    'Quầy bar',
    'Dịch vụ phòng 24/7',
    'Bãi đậu xe',
    'Trung tâm họp'
  ];

  useEffect(() => {
    if (isAuthenticated && userDetails) {
      fetchHotels();
    }
  }, [isAuthenticated, userDetails]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await networkAdapter.get('/api/partner/hotels');
      if (response.success) {
        setHotels(response.data);
      } else {
        setError(response.message || 'Không thể tải danh sách khách sạn');
        toast.error(response.message || 'Không thể tải danh sách khách sạn');
      }
    } catch (err) {
      setError('Không thể tải danh sách khách sạn');
      toast.error('Không thể tải danh sách khách sạn');
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await networkAdapter.get('/api/partner/cities');
        setCities(res.cities);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách thành phố:', err);
      }
    };

    fetchCities();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBenefitChange = (benefit) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  /**
   * Xử lý việc upload ảnh lên Cloudinary
   * @param {Event} e - Event từ input file
   */
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
    console.log('Form submitted:', formData); // Debug log

    try {
      // Validate dữ liệu bắt buộc
      if (!formData.hotelCode || !formData.title || !formData.subtitle) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc (Mã khách sạn, Tên khách sạn, Mô tả ngắn)');
        return;
      }

      // Chuẩn bị dữ liệu gửi đi
      const hotelData = {
        ...formData,
        hotelCode: parseInt(formData.hotelCode),
        ratings: parseInt(formData.ratings),
        // Đảm bảo imageUrls luôn là mảng
        imageUrls: formData.imageUrls || []
      };
      if (selectedHotel) {
        const response = await networkAdapter.put(`/api/partner/hotels/${selectedHotel.id}`, hotelData);
        console.log('Update response:', response); // Debug log response
        if (response.success) {
          toast.success('Cập nhật khách sạn thành công');
          fetchHotels();
          setShowEditModal(false);
        } else {
          toast.error(response.message || 'Không thể cập nhật khách sạn');
        }
      } else {
        const response = await networkAdapter.post('/api/partner/hotels', hotelData);
        console.log('Create response:', response); // Debug log response
        if (response.success) {
          toast.success('Thêm khách sạn thành công');
          fetchHotels();
          setShowAddModal(false);
        } else {
          toast.error(response.message || 'Không thể thêm khách sạn');
        }
      }
      resetForm();
    } catch (err) {
      console.error('Error saving hotel:', err);
      toast.error('Có lỗi xảy ra khi lưu khách sạn');
    }
  };

  const resetForm = () => {
    setFormData({
      hotelCode: '',
      title: '',
      subtitle: '',
      description: '',
      cityId: '',
      propertyType: 'Hotel',
      benefits: [],
      ratings: 5,
      imageUrls: [],
      status: 'Chưa xét duyệt',
      address: 'Chưa Cập Nhật'
    });
    setSelectedHotel(null);
  };

  const handleEdit = (hotel) => {
    setSelectedHotel(hotel);
    setFormData({
      hotelCode: hotel.hotelCode.toString(),
      title: hotel.title,
      subtitle: hotel.subtitle,
      description: hotel.description,
      cityId: hotel.cityId,
      propertyType: hotel.propertyType,
      benefits: hotel.benefits,
      ratings: hotel.ratings,
      imageUrls: hotel.imageUrls,
      status: hotel.status,
      address: hotel.address
    });
    setShowEditModal(true);
  };

  const handleDelete = async (hotelId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách sạn này?')) {
      try {
        const response = await networkAdapter.delete(`/api/partner/hotels/${hotelId}`);
        if (response.success) {
          toast.success('Xóa khách sạn thành công');
          fetchHotels();
        } else {
          toast.error(response.message || 'Không thể xóa khách sạn');
        }
      } catch (err) {
        toast.error('Có lỗi xảy ra khi xóa khách sạn');
        console.error('Error deleting hotel:', err);
      }
    }
  };

  const renderHotelCard = (hotel) => (
    <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={hotel.imageUrls[0] || '/images/default-hotel.jpg'}
          alt={hotel.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-semibold">
          {hotel.ratings} sao
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{hotel.title}</h3>
        <p className="text-gray-600 mb-2">{hotel.subtitle}</p>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{hotel.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {hotel.benefits.slice(0, 3).map((benefit, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {benefit}
            </span>
          ))}
          {hotel.benefits.length > 3 && (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              +{hotel.benefits.length - 3} tiện nghi khác
            </span>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleEdit(hotel)}
            className="text-blue-600 hover:text-blue-800 p-2"
            title="Chỉnh sửa"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDelete(hotel.id)}
            className="text-red-600 hover:text-red-800 p-2"
            title="Xóa"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="text-center text-red-500 p-4">
        Vui lòng đăng nhập để truy cập trang này
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý khách sạn</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Thêm khách sạn mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.length > 0 ? (
          hotels.map(renderHotelCard)
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            Chưa có khách sạn nào. Hãy thêm khách sạn mới!
          </div>
        )}
      </div>

      {/* Modal thêm khách sạn */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Thêm khách sạn mới</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mã khách sạn</label>
                  <input
                    type="number"
                    name="hotelCode"
                    value={formData.hotelCode}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên khách sạn</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mô tả ngắn</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mô tả chi tiết</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loại khách sạn</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Hotel">Khách sạn</option>
                    <option value="Resort">Resort</option>
                    <option value="Homestay">Homestay</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Căn hộ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thành phố</label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Chọn thành phố --</option>
                    {cities.map(city => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Đánh giá</label>
                  <select
                    name="ratings"
                    value={formData.ratings}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="1">1 sao</option>
                    <option value="2">2 sao</option>
                    <option value="3">3 sao</option>
                    <option value="4">4 sao</option>
                    <option value="5">5 sao</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tiện nghi</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {benefitsList.map((benefit) => (
                      <label key={benefit} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.benefits.includes(benefit)}
                          onChange={() => handleBenefitChange(benefit)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{benefit}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
                  <div className="mt-1">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-1 block w-full"
                      disabled={uploadingImages}
                    />
                    {uploadingImages && (
                      <div className="mt-2 flex items-center text-sm text-blue-600">
                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        Đang tải lên hình ảnh...
                      </div>
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {formData.imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Hotel image ${index + 1}`}
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
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Thêm khách sạn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa khách sạn */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa khách sạn</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mã khách sạn</label>
                  <input
                    type="number"
                    name="hotelCode"
                    value={formData.hotelCode}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên khách sạn</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mô tả ngắn</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mô tả chi tiết</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loại khách sạn</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Hotel">Khách sạn</option>
                    <option value="Resort">Resort</option>
                    <option value="Homestay">Homestay</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Căn hộ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thành phố</label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Chọn thành phố --</option>
                    {cities.map(city => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Đánh giá</label>
                  <select
                    name="ratings"
                    value={formData.ratings}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="1">1 sao</option>
                    <option value="2">2 sao</option>
                    <option value="3">3 sao</option>
                    <option value="4">4 sao</option>
                    <option value="5">5 sao</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tiện nghi</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {benefitsList.map((benefit) => (
                      <label key={benefit} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.benefits.includes(benefit)}
                          onChange={() => handleBenefitChange(benefit)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{benefit}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
                  <div className="mt-1">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-1 block w-full"
                      disabled={uploadingImages}
                    />
                    {uploadingImages && (
                      <div className="mt-2 flex items-center text-sm text-blue-600">
                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        Đang tải lên hình ảnh...
                      </div>
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {formData.imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Hotel image ${index + 1}`}
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
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelManagement;

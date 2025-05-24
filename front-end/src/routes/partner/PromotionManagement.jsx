import { useState, useEffect } from 'react';
import { networkAdapter } from 'services/NetworkAdapter';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      fetchPromotions(selectedHotel);
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
          setSelectedHotel(response.data[0]._id);
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

  const fetchPromotions = async (hotelId) => {
    setLoading(true);
    try {
      const response = await networkAdapter.get(`/api/partner/hotels/${hotelId}/promotions`);
      console.log('Promotions response:', response); // Debug log
      if (response.success) {
        setPromotions(response.data);
      } else {
        setError('Không thể tải danh sách khuyến mãi');
        toast.error('Không thể tải danh sách khuyến mãi');
      }
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError('Lỗi kết nối server');
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  if (loadingHotels) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-500" />
        <span className="ml-2">Đang tải danh sách khách sạn...</span>
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý khuyến mãi</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className="border rounded px-3 py-2"
            disabled={loadingHotels}
          >
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.title} {/* Sửa hotel.name thành hotel.title */}
              </option>
            ))}
          </select>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Thêm khuyến mãi mới
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-500" />
          <span className="ml-2">Đang tải danh sách khuyến mãi...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên khuyến mãi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá trị
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
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
              {promotions.length > 0 ? (
                promotions.map((promotion) => (
                  <tr key={promotion._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{promotion.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{promotion.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {promotion.type === 'percentage' ? `${promotion.value}%` : `${promotion.value.toLocaleString('vi-VN')} VNĐ`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(promotion.startDate).toLocaleDateString('vi-VN')} - {new Date(promotion.endDate).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${promotion.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {promotion.status === 'active' ? 'Đang áp dụng' : 'Đã kết thúc'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-500 hover:text-blue-600 mr-3">Sửa</button>
                      <button className="text-red-600 hover:text-red-900">Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Chưa có khuyến mãi nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PromotionManagement; 
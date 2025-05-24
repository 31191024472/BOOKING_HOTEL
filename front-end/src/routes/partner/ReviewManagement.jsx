import { useState, useEffect } from 'react';
import { networkAdapter } from 'services/NetworkAdapter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faSpinner, faEye, faReply, faTrash } from '@fortawesome/free-solid-svg-icons';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [filter, setFilter] = useState('all'); // all, replied, not_replied

  // Dữ liệu mẫu cho đánh giá
  const defaultReviews = [
    {
      _id: '1',
      hotelId: '1',
      bookingId: '1',
      userId: '1',
      rating: 5,
      content: 'Khách sạn rất đẹp, nhân viên phục vụ nhiệt tình. Phòng rộng rãi, sạch sẽ.',
      images: ['/review1.jpg'],
      status: 'published',
      reply: null,
      createdAt: '2024-03-15T10:00:00Z',
      user: {
        name: 'Nguyễn Văn A',
        avatar: '/avatar1.jpg'
      }
    },
    {
      _id: '2',
      hotelId: '1',
      bookingId: '2',
      userId: '2',
      rating: 4,
      content: 'Dịch vụ tốt nhưng giá hơi cao.',
      images: [],
      status: 'published',
      reply: {
        content: 'Cảm ơn bạn đã góp ý. Chúng tôi sẽ cải thiện dịch vụ để phù hợp với giá.',
        createdAt: '2024-03-16T15:30:00Z'
      },
      createdAt: '2024-03-16T14:00:00Z',
      user: {
        name: 'Trần Thị B',
        avatar: '/avatar2.jpg'
      }
    }
  ];

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedHotel) {
      fetchReviews(selectedHotel);
    }
  }, [selectedHotel, filter]);

  const fetchHotels = async () => {
    try {
      const response = await networkAdapter.get('api/partner/hotels');
      if (response.success) {
        setHotels(response.data);
        if (response.data.length > 0) {
          setSelectedHotel(response.data[0]._id);
        }
      }
    } catch (err) {
      setError('Không thể tải danh sách khách sạn');
    }
  };

  const fetchReviews = async (hotelId) => {
    setLoading(true);
    try {
      const response = await networkAdapter.get(`api/partner/hotels/${hotelId}/reviews?status=${filter}`);
      if (response.success) {
        setReviews(response.data);
      } else {
        setError('Không thể tải danh sách đánh giá');
        setReviews(defaultReviews);
      }
    } catch (err) {
      setError('Lỗi kết nối server');
      setReviews(defaultReviews);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId) => {
    try {
      const response = await networkAdapter.post(`api/partner/reviews/${reviewId}/reply`, {
        content: replyContent
      });
      if (response.success) {
        setShowReplyModal(false);
        setReplyContent('');
        fetchReviews(selectedHotel);
      } else {
        setError(response.message || 'Không thể gửi phản hồi');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    }
  };

  const handleDeleteReply = async (reviewId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) {
      try {
        const response = await networkAdapter.delete(`api/partner/reviews/${reviewId}/reply`);
        if (response.success) {
          fetchReviews(selectedHotel);
        } else {
          setError(response.message || 'Không thể xóa phản hồi');
        }
      } catch (err) {
        setError('Lỗi kết nối server');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        className={`${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderReviewCard = (review) => (
    <div key={review._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-start space-x-4 mb-4">
          <img
            src={review.user.avatar || '/default-avatar.jpg'}
            alt={review.user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {review.user.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {formatDate(review.createdAt)}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
              </div>
            </div>
            <p className="mt-2 text-gray-700">{review.content}</p>
            {review.images && review.images.length > 0 && (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Review ${index + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                ))}
              </div>
            )}
            {review.reply && (
              <div className="mt-4 bg-gray-50 p-3 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Phản hồi từ khách sạn</p>
                    <p className="text-sm text-gray-600 mt-1">{review.reply.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(review.reply.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteReply(review._id)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    title="Xóa phản hồi"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              setSelectedReview(review);
              setShowDetailModal(true);
            }}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
            title="Xem chi tiết"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          {!review.reply && (
            <button
              onClick={() => {
                setSelectedReview(review);
                setShowReplyModal(true);
              }}
              className="text-green-600 hover:text-green-800 transition-colors duration-200"
              title="Phản hồi"
            >
              <FontAwesomeIcon icon={faReply} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý đánh giá</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {hotels.map((hotel) => (
              <option key={hotel._id} value={hotel._id}>
                {hotel.name}
              </option>
            ))}
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">Tất cả</option>
            <option value="replied">Đã phản hồi</option>
            <option value="not_replied">Chưa phản hồi</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-brand animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(renderReviewCard)}
        </div>
      )}

      {/* Modal chi tiết đánh giá */}
      {showDetailModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Chi tiết đánh giá</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <img
                  src={selectedReview.user.avatar || '/default-avatar.jpg'}
                  alt={selectedReview.user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-lg font-semibold">{selectedReview.user.name}</h4>
                  <p className="text-sm text-gray-600">{formatDate(selectedReview.createdAt)}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {renderStars(selectedReview.rating)}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-gray-700">{selectedReview.content}</p>
                {selectedReview.images && selectedReview.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {selectedReview.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Review ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              {selectedReview.reply && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Phản hồi từ khách sạn</h4>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-gray-700">{selectedReview.reply.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatDate(selectedReview.reply.createdAt)}
                    </p>
                  </div>
                </div>
              )}

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

      {/* Modal phản hồi */}
      {showReplyModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">Phản hồi đánh giá</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung phản hồi
                </label>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  rows="4"
                  placeholder="Nhập nội dung phản hồi..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyContent('');
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleReply(selectedReview._id)}
                  className="bg-brand text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Gửi phản hồi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement; 
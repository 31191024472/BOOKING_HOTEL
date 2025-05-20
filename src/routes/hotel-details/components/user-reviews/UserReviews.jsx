import Review from './components/Review';
import React, { useState } from 'react';
import RatingsOverview from './components/RatingsOverview';
import UserRatingsSelector from './components/UserRatingsSelector';
import { networkAdapter } from 'services/NetworkAdapter';
import Toast from 'components/ux/toast/Toast';
import PaginationController from 'components/ux/pagination-controller/PaginationController';
import Loader from 'components/ux/loader/loader';

/**
 * Renders the user reviews component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.reviewData - The review data object.
 * @param {string} props.hotelCode - The hotel code.
 * @returns {JSX.Element} The user reviews component.
 */
const UserReviews = ({
  reviewData,
  handlePageChange,
  handlePreviousPageChange,
  handleNextPageChange,
  hotelCode
}) => {
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [shouldHideUserRatingsSelector, setShouldHideUserRatingsSelector] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles the selected user rating.
   * @param {number} rate - The rating value.
   */
  const handleRating = (rate) => {
    setUserRating(rate);
  };

  const clearToastMessage = () => {
    setToastMessage('');
  };

  const handleReviewSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!hotelCode) {
        setToastMessage({
          type: 'error',
          message: 'Không tìm thấy mã khách sạn',
        });
        return;
      }

      if (userRating === 0) {
        setToastMessage({
          type: 'error',
          message: 'Vui lòng chọn đánh giá trước khi gửi.',
        });
        return;
      }

      if (!userReview.trim()) {
        setToastMessage({
          type: 'error',
          message: 'Vui lòng nhập nội dung đánh giá.',
        });
        return;
      }

      if (userReview.trim().length < 10) {
        setToastMessage({
          type: 'error',
          message: 'Nội dung đánh giá phải có ít nhất 10 ký tự.',
        });
        return;
      }

      console.log('Dữ liệu đánh giá sẽ gửi đi:', {
        hotelCode,
        rating: userRating,
        review: userReview.trim()
      });

      const response = await networkAdapter.post(`/api/hotels/${hotelCode}/reviews`, {
        rating: userRating,
        review: userReview.trim()
      });


      if (response.success) {
        setToastMessage({
          type: 'success',
          message: 'Cảm ơn bạn đã đánh giá khách sạn!',
        });
        setShouldHideUserRatingsSelector(true);
        setTimeout(() => {
          setToastMessage('');
          window.location.reload();
        }, 2000);
        // Reset form
        setUserRating(0);
        setUserReview('');
        // Refresh danh sách đánh giá
        handlePageChange(1);
        
      } else {
        setToastMessage({
          type: 'error',
          message: response.message || 'Gửi đánh giá thất bại',
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setToastMessage({
        type: 'error',
        message: error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserReviewChange = (review) => {
    setUserReview(review);
  };

  const isEmpty = reviewData.data.length === 0;

  return (
    <div className="flex flex-col p-4 border-t">
      <h1 className="text-xl font-bold text-gray-700">Đánh giá từ khách hàng</h1>
      <div className="flex flex-col md:flex-row py-4 bg-white shadow-sm gap-6">
        {reviewData.data.length === 0 ? (
          <div className="w-3/5">
            <span className="text-gray-500 italic">
              Hãy là người đầu tiên để lại đánh giá!
            </span>
          </div>
        ) : (
          <RatingsOverview
            averageRating={reviewData.metadata.averageRating}
            ratingsCount={reviewData.metadata.totalReviews}
            starCounts={reviewData.metadata.starCounts}
          />
        )}
        {shouldHideUserRatingsSelector ? null : (
          <UserRatingsSelector
            userRating={userRating}
            isEmpty={isEmpty}
            handleRating={handleRating}
            userReview={userReview}
            handleReviewSubmit={handleReviewSubmit}
            handleUserReviewChange={handleUserReviewChange}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          dismissError={clearToastMessage}
        />
      )}
      <div>
        {reviewData.isLoading ? (
          <Loader height={'600px'} />
        ) : (
          <div>
            {reviewData.data.map((review, index) => (
              <Review
                key={index}
                reviewerName={`${review.userId.lastName}`}
                reviewDate={review.date}
                review={review.review}
                rating={review.rating}
                verified={review.verified ? "Đã xác thực" : "Chưa xác thực"}
              />
            ))}
          </div>
        )}
      </div>
      {reviewData.data.length > 0 && reviewData.pagination && (
  <PaginationController
    currentPage={reviewData.pagination?.currentPage || 1}
    totalPages={reviewData.pagination?.totalPages || 1}
    handlePageChange={handlePageChange}
    handlePreviousPageChange={handlePreviousPageChange}
    handleNextPageChange={handleNextPageChange}
  />
)}

    </div>
  );
};

export default UserReviews;

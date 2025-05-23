import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { AuthContext } from 'contexts/AuthContext';
import Loader from 'components/ux/loader/loader';
/**
 * Renders the user ratings selector component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.userRating - The user's rating.
 * @param {Function} props.handleRating - The function to handle rating changes made by user.
 * @param {boolean} props.isEmpty - The flag to determine if the user review is empty.
 * @param {string} props.userReview - The user's review.
 * @param {Function} props.handleReviewSubmit - The function to handle user review submission.
 * @param {Function} props.handleUserReviewChange - The function to handle user review changes.
 * @param {boolean} props.isSubmitting - The flag to determine if the review is being submitted.
 * @returns {JSX.Element} The rendered component.
 */
const UserRatingsSelector = ({
  userRating,
  handleRating,
  isEmpty,
  userReview,
  handleReviewSubmit,
  handleUserReviewChange,
  isSubmitting
}) => {
  const { isAuthenticated } = React.useContext(AuthContext);

  return isAuthenticated ? (
    <div
      className={`${
        isEmpty ? 'md:w-full' : 'md:w-2/5'
      } pl-0 md:pl-4 md:border-l flex flex-col items-center justify-center`}
    >
      <div className="text-lg font-semibold text-gray-700">Đánh giá của bạn</div>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={star <= userRating ? fasStar : farStar}
            className={`cursor-pointer mx-1 text-2xl ${
              star <= userRating ? 'text-yellow-400' : 'text-gray-400'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !isSubmitting && handleRating(star)}
            style={{ pointerEvents: isSubmitting ? 'none' : 'auto' }}
          />
        ))}
      </div>
      <textarea
        rows={3}
        className={`w-full p-2 my-2 border ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        value={userReview}
        onChange={(e) => !isSubmitting && handleUserReviewChange(e.target.value)}
        placeholder="Viết đánh giá của bạn..."
        disabled={isSubmitting}
      />
      <button
        className={`w-full px-4 py-2 my-2 font-bold text-white rounded bg-brand hover:bg-blue-700 focus:outline-none focus:shadow-outline ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleReviewSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
      </button>
      {isSubmitting && (
        <div className="mt-2">
          <Loader height="20px" />
        </div>
      )}
    </div>
  ) : (
    <p className="font-semibold text-gray-700">
      Vui lòng đăng nhập để gửi đánh giá
    </p>
  );
};

export default UserRatingsSelector;

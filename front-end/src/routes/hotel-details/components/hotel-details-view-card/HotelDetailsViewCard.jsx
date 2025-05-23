import React, { useEffect, useState } from 'react';
import HotelBookingDetailsCard from '../hotel-booking-details-card/HotelBookingDetailsCard';
import UserReviews from '../user-reviews/UserReviews';
import ReactImageGallery from 'react-image-gallery';
import { networkAdapter } from 'services/NetworkAdapter';

const HotelDetailsViewCard = ({ hotelDetails }) => {
  // console.log("Check hotelDetail data :", hotelDetails);

  const images = (hotelDetails.imageUrls || []).map((image) => ({
    original: image,
    thumbnail: image,
    thumbnailClass: 'h-[80px]',
    thumbnailLoading: 'lazy',
  }));

  const [reviewData, setReviewData] = useState({
    isLoading: true,
    data: [],
    metadata: {},
  });
  const [currentReviewsPage, setCurrentReviewPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentReviewPage(page);
  };

  const handlePreviousPageChange = () => {
    setCurrentReviewPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPageChange = () => {
    setCurrentReviewPage((prev) => {
      if (!reviewData.metadata || prev >= reviewData.metadata.totalPages) return prev;
      return prev + 1;
    });
  };

  useEffect(() => {
    setReviewData({
      isLoading: true,
      data: [],
      metadata: {},
    });

    const fetchHotelReviews = async () => {
      try {
        const response = await networkAdapter.get(
          `api/hotels/${hotelDetails.hotelCode}/reviews?page=${currentReviewsPage}`
        );
        // console.log("Reviews response:", response);

        if (response.success) {
          setReviewData({
            isLoading: false,
            data: response.data.elements,
            metadata: response.metadata || {},
          });
        } else {
          setReviewData({
            isLoading: false,
            data: [],
            metadata: {},
            error: response.errors?.[0] || "Không thể tải đánh giá"
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đánh giá:", error);
        setReviewData({
          isLoading: false,
          data: [],
          metadata: {},
          error: "Lỗi kết nối đến server"
        });
      }
    };

    fetchHotelReviews();
  }, [hotelDetails.hotelCode, currentReviewsPage]);

  return (
    <div className="flex items-start justify-center flex-wrap md:flex-nowrap container mx-auto p-4">
      <div className="w-[800px] bg-white shadow-lg rounded-lg overflow-hidden">
        <div>
          {/* Phần hiển thị hình ảnh */}
          <div className="relative w-full">
            <ReactImageGallery items={images} showPlayButton={false} showFullscreenButton={false} />
            {hotelDetails.discount && (
              <div className="absolute top-0 right-0 m-4 px-2 py-1 bg-yellow-500 text-white font-semibold text-xs rounded">
                Giảm {hotelDetails.discount}%
              </div>
            )}
          </div>
          {/* Phần thông tin chi tiết */}
          <div className="p-4">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              {hotelDetails.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {hotelDetails.subtitle}
            </p>
            <div className="mt-2 space-y-2">
              {(Array.isArray(hotelDetails.description) ? hotelDetails.description : [hotelDetails.description])
                .map((line, index) => (
                  <p key={index} className="text-gray-700">{line}</p>
              ))}
            </div>
            {/* Phần tiện nghi */}
            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-sm text-gray-600">
                  {hotelDetails.benefits.join(' | ')}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Phần đánh giá */}
        <UserReviews
          reviewData={reviewData}
          handlePageChange={handlePageChange}
          handlePreviousPageChange={handlePreviousPageChange}
          handleNextPageChange={handleNextPageChange}
          hotelCode={hotelDetails.hotelCode}
        />
      </div>
      <HotelBookingDetailsCard hotelCode={hotelDetails.hotelCode} />
    </div>
  );
};

export default HotelDetailsViewCard;

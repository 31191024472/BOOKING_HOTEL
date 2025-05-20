import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HotelDetailsViewCard from './components/hotel-details-view-card/HotelDetailsViewCard';
import HotelDetailsViewCardSkeleton from './components/hotel-details-view-card-skeleton/HotelDetailsViewCardSkeleton';
import { networkAdapter } from 'services/NetworkAdapter';

/**
 * Đại diện cho component chi tiết khách sạn.
 * @component
 * @returns {JSX.Element} Component chi tiết khách sạn.
 */
const HotelDetails = () => {
  const { hotelId } = useParams();
  const [hotelDetails, setHotelDetails] = useState({
    isLoading: true,
    data: {},
    error: null
  });

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await networkAdapter.get(`api/hotels/${hotelId}`);
        console.log("Hotel details response:", response);
        
        if (response.success) {
          setHotelDetails({
            isLoading: false,
            data: response.data,
            error: null
          });
        } else {
          setHotelDetails({
            isLoading: false,
            data: {},
            error: response.errors?.[0] || "Không thể tải thông tin khách sạn"
          });
        }
      } catch (error) {
        console.error("Error fetching hotel details:", error);
        setHotelDetails({
          isLoading: false,
          data: {},
          error: "Lỗi kết nối đến server"
        });
      }
    };

    fetchHotelDetails();
  }, [hotelId]);

  if (hotelDetails.error) {
    return <div className="text-center text-red-500 p-4">{hotelDetails.error}</div>;
  }

  return (
    <>
      {hotelDetails.isLoading ? (
        <HotelDetailsViewCardSkeleton />
      ) : (
        <HotelDetailsViewCard hotelDetails={hotelDetails.data} />
      )}
    </>
  );
};

export default HotelDetails;

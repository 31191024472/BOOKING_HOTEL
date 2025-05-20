import React, { useState, useEffect, useRef } from 'react';
import Tabs from 'components/ux/tabs/Tabs';
import TabPanel from 'components/ux/tab-panel/TabPanel';
import {
  faAddressCard,
  faHotel,
  faCreditCard,
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from 'contexts/AuthContext';
import { networkAdapter } from 'services/NetworkAdapter';
import { useContext } from 'react';
import PaymentMethodsPanel from './components/PaymentsMethodsPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import useOutsideClickHandler from 'hooks/useOutsideClickHandler';
import { useNavigate } from 'react-router-dom';
import BookingPanel from './components/BookingPanel';
import ProfileDetailsPanel from './components/ProfileDetailsPanel';

/**
 * UserProfile
 * Renders the user profile page with tabs for personal details, bookings, and payment methods.
 * @returns {JSX.Element} - The UserProfile component
 * */
const UserProfile = () => {
  const { userDetails } = useContext(AuthContext);
  const navigate = useNavigate();

  const wrapperRef = useRef();
  const buttonRef = useRef();

  const [isTabsVisible, setIsTabsVisible] = useState(false);

  // Fetch user bookings data
  const [userBookingsData, setUserBookingsData] = useState({
    isLoading: true,
    data: [],
    errors: [],
  });

  // Fetch user payment methods data
  const [userPaymentMethodsData, setUserPaymentMethodsData] = useState({
    isLoading: true,
    data: [],
    errors: [],
  });

  useOutsideClickHandler(wrapperRef, (event) => {
    if (!buttonRef.current.contains(event.target)) {
      setIsTabsVisible(false);
    }
  });

  const onTabsMenuButtonAction = () => {
    setIsTabsVisible(!isTabsVisible);
  };

  // effect to set initial state of user details
  useEffect(() => {
    if (!userDetails) {
      navigate('/login');
    }
  }, [navigate, userDetails]);

  // effect to set initial state of user bookings data
  useEffect(() => {
    const getInitialData = async () => {
      try {
        const userBookingsDataResponse = await networkAdapter.get('/api/users/bookings');
        const userPaymentMethodsResponse = await networkAdapter.get('/api/users/payment-methods');
        
        if (userBookingsDataResponse && userBookingsDataResponse.data) {
          setUserBookingsData({
            isLoading: false,
            data: userBookingsDataResponse.data.elements,
            errors: userBookingsDataResponse.errors || [],
          });
        } else {
          setUserBookingsData({
            isLoading: false,
            data: [],
            errors: ['Không thể lấy danh sách đặt phòng'],
          });
        }

        if (userPaymentMethodsResponse && userPaymentMethodsResponse.data) {
          setUserPaymentMethodsData({
            isLoading: false,
            data: userPaymentMethodsResponse.data.elements,
            errors: userPaymentMethodsResponse.errors || [],
          });
        } else {
          setUserPaymentMethodsData({
            isLoading: false,
            data: [],
            errors: ['Không thể lấy danh sách phương thức thanh toán'],
          });
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        setUserBookingsData({
          isLoading: false,
          data: [],
          errors: [error.message || 'Có lỗi xảy ra khi lấy danh sách đặt phòng'],
        });
        setUserPaymentMethodsData({
          isLoading: false,
          data: [],
          errors: [error.message || 'Có lỗi xảy ra khi lấy danh sách phương thức thanh toán'],
        });
      }
    };
    getInitialData();
  }, []);

  return (
    <>
      <div className="container mx-auto p-4 my-10 min-h-[530px]">
        <div className="mx-4">
          <button
            ref={buttonRef}
            onClick={onTabsMenuButtonAction}
            className="block md:hidden items-center px-4 py-1.5 border border-gray-300 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FontAwesomeIcon
              icon={isTabsVisible ? faXmark : faBars}
              size="lg"
            />
          </button>
        </div>
        <Tabs isTabsVisible={isTabsVisible} wrapperRef={wrapperRef}>
          <TabPanel label="Thông tin cá nhân" icon={faAddressCard}>
            <ProfileDetailsPanel userDetails={userDetails} />
          </TabPanel>
          <TabPanel label="Lịch sử đặt phòng" icon={faHotel}>
            <BookingPanel bookings={userBookingsData.data} />
          </TabPanel>
          <TabPanel label="Phương thức thanh toán" icon={faCreditCard}>
            <PaymentMethodsPanel
              userPaymentMethodsData={userPaymentMethodsData}
              setUserPaymentMethodsData={setUserPaymentMethodsData}
            />
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default UserProfile;

import HeroCover from './components/hero-cover/HeroCover';
import PopularLocations from './components/popular-locations/popular-locations';
import { useState, useEffect, useCallback } from 'react';
import { MAX_GUESTS_INPUT_VALUE } from 'utils/constants';
import ResultsContainer from 'components/results-container/ResultsContainer';
import { formatDate } from 'utils/date-helpers';
import { useNavigate } from 'react-router-dom';
import _debounce from 'lodash/debounce'; 
import { networkAdapter } from 'services/NetworkAdapter';

/**
 * Component Home hiển thị trang chính của ứng dụng.
 * Bao gồm thanh điều hướng, hero cover, địa điểm phổ biến, container kết quả và footer.
 */
const Home = () => {
  const navigate = useNavigate();

  // Các biến state
  const [isDatePickerVisible, setisDatePickerVisible] = useState(false);
  const [locationInputValue, setLocationInputValue] = useState('');
  const [numGuestsInputValue, setNumGuestsInputValue] = useState('');
  const [popularDestinationsData, setPopularDestinationsData] = useState({
    isLoading: true,
    data: [],
    errors: [],
  });
  const [hotelsResults, setHotelsResults] = useState({
    isLoading: true,
    data: [],
    errors: [],
  });

  // State để lưu trữ các thành phố có sẵn
  const [availableCities, setAvailableCities] = useState([]);

  const [filteredTypeheadResults, setFilteredTypeheadResults] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = useCallback(_debounce(queryResults, 1000), []);

  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection',
    },
  ]);

  const onDatePickerIconClick = () => {
    setisDatePickerVisible(!isDatePickerVisible);
  };

  const onLocationChangeInput = async (newValue) => {
    setLocationInputValue(newValue);
    // Debounce hàm queryResults để tránh gửi quá nhiều yêu cầu
    debounceFn(newValue, availableCities);
  };

  /**
   * Truy vấn các thành phố có sẵn dựa trên input của người dùng.
   * @param {string} query - Input của người dùng.
   * @returns {void}
   */
  function queryResults(query, availableCities) {
    const filteredResults = availableCities
      .filter((city) => city.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
    setFilteredTypeheadResults(filteredResults);
  }

  const onNumGuestsInputChange = (numGuests) => {
    if (
      (numGuests < MAX_GUESTS_INPUT_VALUE && numGuests > 0) ||
      numGuests === ''
    ) {
      setNumGuestsInputValue(numGuests);
    }
  };

  const onDateChangeHandler = (ranges) => {
    setDateRange([ranges.selection]);
  };

  /**
   * Xử lý sự kiện click nút tìm kiếm.
   * Thu thập số lượng khách, ngày check-in và check-out, và thành phố đã chọn
   * từ state của component, sau đó chuyển hướng đến route '/hotels' với dữ liệu này.
   */
  const onSearchButtonAction = () => {
    const numGuest = Number(numGuestsInputValue);
    const checkInDate = formatDate(dateRange[0].startDate) ?? '';
    const checkOutDate = formatDate(dateRange[0].endDate) ?? '';
    const city = locationInputValue;
    navigate('/hotels', {
      state: {
        numGuest,
        checkInDate,
        checkOutDate,
        city,
      },
    });
  };

  useEffect(() => {
    /**
     * Lấy dữ liệu ban đầu cho route Home.
     */
    const getInitialData = async () => {
      try {
        // Gọi API sử dụng networkAdapter
        const popularDestinationsResponse = await networkAdapter.get('api/hotels/popularDestinations');
        const hotelsResultsResponse = await networkAdapter.get('api/hotels/nearbyHotels');
        const availableCitiesResponse = await networkAdapter.get('api/hotels/availableCities');
        // console.log("Available cities response:", availableCitiesResponse);
        // console.log("Popular destinations response:", popularDestinationsResponse);
        // console.log("Hotels results response:", hotelsResultsResponse);
        // Cập nhật state với dữ liệu từ response
        if (availableCitiesResponse.success) {
          setAvailableCities(availableCitiesResponse.data);
        }
  
        if (popularDestinationsResponse.success) {
          setPopularDestinationsData({
            isLoading: false,
            data: popularDestinationsResponse.data.elements,
            errors: null, 
          });
        }
  
        if (hotelsResultsResponse.success) {
          setHotelsResults({
            isLoading: false,
            data: hotelsResultsResponse.data,
            errors: null,
          });
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        
        // Nếu có lỗi, cập nhật state tương ứng
        setPopularDestinationsData({
          isLoading: false,
          data: [],
          errors: error.message,
        });
  
        setHotelsResults({
          isLoading: false,
          data: [],
          errors: error.message,
        });
  
        setAvailableCities([]);
      }
    };
  
    getInitialData();
  }, []);
  
  return (
    <>
      <HeroCover
        locationInputValue={locationInputValue}
        numGuestsInputValue={numGuestsInputValue}
        locationTypeheadResults={filteredTypeheadResults}
        isDatePickerVisible={isDatePickerVisible}
        setisDatePickerVisible={setisDatePickerVisible}
        onLocationChangeInput={onLocationChangeInput}
        onNumGuestsInputChange={onNumGuestsInputChange}
        dateRange={dateRange}
        onDateChangeHandler={onDateChangeHandler}
        onDatePickerIconClick={onDatePickerIconClick}
        onSearchButtonAction={onSearchButtonAction}
      />
      <div className="container mx-auto">
        <PopularLocations popularDestinationsData={popularDestinationsData} />
        <div className="my-8">
          <h2 className="text-3xl font-medium text-slate-700 text-center my-2">
            Khách sạn gần đây được chọn lọc cho bạn
          </h2>
          <ResultsContainer
            hotelsResults={hotelsResults}
            enableFilters={false}
          />
        </div>
      </div>
    </>
  );
};

export default Home;

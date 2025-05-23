import React, { useState, useEffect, useCallback } from 'react';
import GlobalSearchBox from 'components/global-search-box/GlobalSearchbox';
import ResultsContainer from 'components/results-container/ResultsContainer';
import { networkAdapter } from 'services/NetworkAdapter';
import isEmpty from 'utils/helpers';
import { useLocation, useSearchParams } from 'react-router-dom';
import PaginationController from 'components/ux/pagination-controller/PaginationController';
import { SORTING_FILTER_LABELS } from 'utils/constants';
import _debounce from 'lodash/debounce';

/**
 * Đại diện cho component tìm kiếm khách sạn.
 * @component
 * @returns {JSX.Element} Component tìm kiếm khách sạn.
 */
const HotelsSearch = () => {
  // State cho việc quản lý giá trị input địa điểm
  const [locationInputValue, setLocationInputValue] = useState('');

  // State cho việc lưu trữ các thành phố có sẵn
  const [availableCities, setAvailableCities] = useState([]);

  // State cho việc quản lý trang kết quả hiện tại
  const [currentResultsPage, setCurrentResultsPage] = useState(1);

  // State cho việc quản lý dữ liệu bộ lọc
  const [filtersData, setFiltersData] = useState({
    isLoading: true,
    data: [],
    errors: [],
  });

  // State cho việc lưu trữ kết quả tìm kiếm khách sạn
  const [hotelsResults, setHotelsResults] = useState({
    isLoading: true,
    data: [],
    errors: [],
  });

  // State cho việc quản lý giá trị bộ lọc sắp xếp
  const [sortByFilterValue, setSortByFilterValue] = useState({
    value: 'default',
    label: 'Sort by',
  });

  // State cho việc quản lý các bộ lọc đã chọn
  const [selectedFiltersState, setSelectedFiltersState] = useState({});

  const [filteredTypeheadResults, setFilteredTypeheadResults] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = useCallback(_debounce(queryResults, 1000), []);

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Các tùy chọn cho bộ lọc sắp xếp
  const sortingFilterOptions = [
    { value: 'default', label: 'Sort by' },
    { value: 'priceLowToHigh', label: SORTING_FILTER_LABELS.PRICE_LOW_TO_HIGH },
    { value: 'priceHighToLow', label: SORTING_FILTER_LABELS.PRICE_HIGH_TO_LOW },
  ];

  /**
   * Xử lý cập nhật bộ lọc sắp xếp.
   * @param {Object} selectedOption - Tùy chọn đã chọn.
   */
  const onSortingFilterChange = (selectedOption) => {
    setSortByFilterValue(selectedOption);
  };

  /**
   * Xử lý cập nhật các bộ lọc.
   * @param {Object} updatedFilter - Đối tượng bộ lọc được cập nhật.
   */
  const onFiltersUpdate = (updatedFilter) => {
    setSelectedFiltersState((prevState) => {
      const newState = prevState.map((filterGroup) => {
        if (filterGroup.filterId === updatedFilter.filterId) {
          return {
            ...filterGroup,
            filters: filterGroup.filters.map((filter) => {
              if (filter.id === updatedFilter.id) {
                return {
                  ...filter,
                  isSelected: !filter.isSelected,
                };
              }
              return filter;
            }),
          };
        }
        return filterGroup;
      });
      return newState;
    });
  };

  const onSearchButtonAction = () => {
    setSearchParams({
      city: locationInputValue,
    });
    fetchHotels({
      city: locationInputValue,
    });
  };

  const getActiveFilters = () => {
    const filters = {};
    selectedFiltersState.forEach((category) => {
      const selectedValues = category.filters
        .filter((filter) => filter.isSelected)
        .map((filter) => filter.value);

      if (selectedValues.length > 0) {
        filters[category.filterId] = selectedValues;
      }
    });
    
    if (!isEmpty(filters)) {
      return filters;
    }
    return null;
  };

  /**
   * Xử lý thay đổi trong input địa điểm.
   * Làm mới dữ liệu khách sạn nếu địa điểm hợp lệ.
   * @param {string} value - Giá trị địa điểm mới.
   */
  const onLocationChangeInput = async (newValue) => {
    setLocationInputValue(newValue);
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

  const onClearFiltersAction = () => {
    const hasActiveFilters = selectedFiltersState.some((filterGroup) =>
      filterGroup.filters.some((filter) => filter.isSelected)
    );

    if (hasActiveFilters) {
      setSelectedFiltersState(
        selectedFiltersState.map((filterGroup) => ({
          ...filterGroup,
          filters: filterGroup.filters.map((filter) => ({
            ...filter,
            isSelected: false,
          })),
        }))
      );
    }
  };

  /**
   * Lấy dữ liệu khách sạn dựa trên các bộ lọc được cung cấp.
   * @param {Object} filters - Các bộ lọc cần áp dụng.
   * @returns {Promise<void>}
   * @async
   */
  const fetchHotels = async (filters) => {
    setHotelsResults({
      isLoading: true,
      data: [],
      errors: [],
    });

    try {
      const queryParams = {
        city: filters.city || locationInputValue.toLowerCase(),
        page: filters.page || currentResultsPage,
        limit: filters.limit || 5,
        sortBy: sortByFilterValue.value
      };

      if (filters.star_ratings) {
        queryParams.star_ratings = JSON.stringify(filters.star_ratings);
      }
      if (filters.property_type) {
        queryParams.property_type = JSON.stringify(filters.property_type);
      }

      const response = await networkAdapter.get('/api/hotels', queryParams);

      setHotelsResults({
        success: response.success,
        data: response.data || [],
        errors: response.errors || [],
        pagination: response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          limit: 5
        }
      });
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu khách sạn:', error);
      setHotelsResults({
        success: false,
        data: [],
        errors: [error.message],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          limit: 5
        }
      });
    }
  };
  

  const getVerticalFiltersData = async () => {
    try {
      const response = await networkAdapter.get('/api/hotels/verticalFilters');
      if (response.success) {
        setFiltersData({
          success: response.success,
          data: response.data.elements,
          errors: response.errors,
        });
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
      setFiltersData({
        isLoading: false,
        data: [],
        errors: [error.message]
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentResultsPage(page);
    fetchHotels({
      city: locationInputValue,
      ...getActiveFilters(),
      page,
      limit: 5
    });
  };

  const handlePreviousPageChange = () => {
    if (currentResultsPage > 1) {
      handlePageChange(currentResultsPage - 1);
    }
  };

  const handleNextPageChange = () => {
    if (currentResultsPage < hotelsResults.pagination.totalPages) {
      handlePageChange(currentResultsPage + 1);
    }
  };

  // Lấy danh sách các thành phố có sẵn
  const fetchAvailableCities = async () => {
    try {
      const response = await networkAdapter.get('/api/hotels/availableCities');
      if (response.success) {
        setAvailableCities(response.data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };
  // Lấy danh sách thành phố và dữ liệu ban đầu khi component được mount
  useEffect(() => {
    fetchAvailableCities();
    getVerticalFiltersData();
  }, []);

  // Cập nhật giá trị input địa điểm nếu có city trong URL
  useEffect(() => {
    if (searchParams.get('city')) {
      setLocationInputValue(searchParams.get('city'));
    }
  }, [searchParams]);

  // Cập nhật state bộ lọc đã chọn khi dữ liệu bộ lọc thay đổi
  useEffect(() => {
    setSelectedFiltersState(
      filtersData.data.map((filterGroup) => ({
        ...filterGroup,
        filters: filterGroup.filters.map((filter) => ({
          ...filter,
          isSelected: false,
        })),
      }))
    );
  }, [filtersData]);
  
  useEffect(() => {
    if (selectedFiltersState.length > 0) {
      const activeFilters = getActiveFilters();
      
      if (activeFilters) {
        activeFilters.city = locationInputValue.toLowerCase();
        fetchHotels(activeFilters);
      } else {
        fetchHotels({
          city: locationInputValue,
        });
      }
    }
  }, [selectedFiltersState, currentResultsPage, sortByFilterValue]);

  // Lấy dữ liệu khách sạn khi giá trị input địa điểm thay đổi
  useEffect(() => {
    if (location.state) {
      const { city } = location.state;
      setLocationInputValue(city);
    }
  }, [location]);

  return (
    <div className="hotels">
      <div className="bg-brand px-2 lg:h-[120px] h-[220px] flex items-center justify-center">
        <GlobalSearchBox
          locationInputValue={locationInputValue}
          locationTypeheadResults={filteredTypeheadResults}
          onLocationChangeInput={onLocationChangeInput}
          onSearchButtonAction={onSearchButtonAction}
        />
      </div>
      <div className="my-4"></div>
      <div className="w-[180px]"></div>
      <ResultsContainer
        hotelsResults={hotelsResults}
        enableFilters={true}
        filtersData={filtersData}
        onFiltersUpdate={onFiltersUpdate}
        onClearFiltersAction={onClearFiltersAction}
        selectedFiltersState={selectedFiltersState}
        sortByFilterValue={sortByFilterValue}
        onSortingFilterChange={onSortingFilterChange} 
        sortingFilterOptions={sortingFilterOptions}
      />
      {hotelsResults.pagination?.totalPages > 1 && (
        <div className="my-4">
          <PaginationController
            currentPage={currentResultsPage}
            totalPages={hotelsResults.pagination?.totalPages}
            handlePageChange={handlePageChange}
            handlePreviousPageChange={handlePreviousPageChange}
            handleNextPageChange={handleNextPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default HotelsSearch;

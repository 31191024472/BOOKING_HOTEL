import HotelViewCard from 'components/hotel-view-card/HotelViewCard';
import VerticalFilters from 'components/vertical-filters/VerticalFilters';
import HotelViewCardSkeleton from 'components/hotel-view-card-skeleton/HotelViewCardSkeleton';
import VerticalFiltersSkeleton from 'components/vertical-filters-skeleton/VerticalFiltersSkeleton';
import EmptyHotelsState from 'components/empty-hotels-state/EmptyHotelsState';
import { useRef, useState } from 'react';
import useOutsideClickHandler from 'hooks/useOutsideClickHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

/**
 * Component ResultsContainer
 * Hiển thị container chứa kết quả khách sạn, bao gồm các thẻ khách sạn và bộ lọc.
 * Hỗ trợ bật/tắt bộ lọc dọc và hiển thị khung xương hoặc trạng thái trống dựa trên trạng thái tải hoặc dữ liệu.
 *
 * @param {Object} props - Props của component.
 * @param {Object} props.hotelsResults - Đối tượng chứa dữ liệu kết quả khách sạn và trạng thái tải.
 * @param {boolean} props.enableFilters - Cờ bật/tắt tính năng lọc.
 * @param {Array} props.filtersData - Mảng chứa dữ liệu bộ lọc cho bộ lọc dọc.
 * @param {Array} props.selectedFiltersState - Mảng chứa trạng thái bộ lọc đã chọn.
 * @param {Function} props.onFiltersUpdate - Hàm callback xử lý cập nhật bộ lọc.
 * @param {Function} props.onClearFiltersAction - Hàm callback xử lý hành động xóa bộ lọc.
 * @param {Array} props.sortingFilterOptions - Mảng chứa các tùy chọn sắp xếp.
 * @param {Object} props.sortByFilterValue - Đối tượng chứa giá trị sắp xếp đã chọn.
 * @param {Function} props.onSortingFilterChange - Hàm callback xử lý thay đổi bộ lọc sắp xếp.
 */
const ResultsContainer = (props) => {
  const {
    hotelsResults,
    enableFilters,
    filtersData,
    selectedFiltersState,
    onFiltersUpdate,
    onClearFiltersAction,
    sortingFilterOptions,
    sortByFilterValue,
    onSortingFilterChange,
  } = props;

  // Check if sorting filter is visible
  const isSortingFilterVisible =
    sortingFilterOptions && sortingFilterOptions.length > 0;

  const [isVerticalFiltersOpen, setIsVerticalFiltersOpen] = useState(false);

  const wrapperRef = useRef();
  const buttonRef = useRef();

  useOutsideClickHandler(wrapperRef, (event) => {
    if (!buttonRef.current.contains(event.target)) {
      setIsVerticalFiltersOpen(false);
    }
  });

  const toggleVerticalFiltersAction = () => {
    // Toggle based on the current state
    setIsVerticalFiltersOpen((prevState) => !prevState);
  };

  return (
    <div className="relative">
      <div className="flex gap-x-0 md:gap-x-4 items-start mx-2">
        {enableFilters && selectedFiltersState.length > 0 && (
          <div ref={wrapperRef}>
            <VerticalFilters
              filtersData={selectedFiltersState}
              onFiltersUpdate={onFiltersUpdate}
              onClearFiltersAction={onClearFiltersAction}
              isVerticalFiltersOpen={isVerticalFiltersOpen}
            />
          </div>
        )}
        {enableFilters && filtersData.isLoading && <VerticalFiltersSkeleton />}
        <div className="flex flex-col w-full items-start">
          <div className="flex w-full justify-between px-2 md:px-0">
            {enableFilters && (
              <div className="vertical-filters__toggle-menu block md:hidden">
                <button
                  ref={buttonRef}
                  data-testid="vertical-filters__toggle-menu"
                  onClick={toggleVerticalFiltersAction}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FontAwesomeIcon icon={faFilter} size="sm" className="mr-1" />{' '}
                  Filters
                </button>
              </div>
            )}
            {isSortingFilterVisible && (
              <Select
                value={sortByFilterValue}
                onChange={onSortingFilterChange}
                options={sortingFilterOptions}
                className="mb-2 w-[180px] text-sm"
              />
            )}
          </div>
          <div className="hotels-results__container mx-2 md:mx-0 flex flex-col gap-y-2 w-full">
            {/* {console.log("Check hotelResult:", hotelsResults)} */}
            {hotelsResults.isLoading? (
              Array.from({ length: 5 }, (_, index) => (
                <HotelViewCardSkeleton key={index} />
              ))
            ) : hotelsResults.data && hotelsResults.data.length > 0 ? (
              hotelsResults.data.map((hotel) => (
                <HotelViewCard
                  key={hotel.hotelCode}
                  id={hotel.hotelCode}
                  title={hotel.title}
                  image={hotel.imageUrls?.[0]}
                  subtitle={hotel.subtitle}
                  benefits={hotel.benefits}
                  ratings={hotel.ratings}
                  price={""}
                />
              ))
            ) : (
              <EmptyHotelsState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsContainer;

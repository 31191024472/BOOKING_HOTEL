import GlobalSearchBox from 'components/global-search-box/GlobalSearchbox';

/**
 * Component HeroCover
 * Hiển thị phần hero cover của trang chủ.
 * @param {Object} props - Các props của component.
 * @param {String} props.locationInputValue - Giá trị input địa điểm.
 * @param {String} props.numGuestsInputValue - Giá trị input số lượng khách.
 * @param {Boolean} props.isDatePickerVisible - Trạng thái hiển thị date picker.
 * @param {Function} props.onLocationChangeInput - Hàm xử lý thay đổi input địa điểm.
 * @param {Function} props.onNumGuestsInputChange - Hàm xử lý thay đổi input số lượng khách.
 * @param {Object} props.dateRange - Đối tượng khoảng thời gian.
 * @param {Function} props.onDateChangeHandler - Hàm xử lý thay đổi ngày.
 * @param {Function} props.onDatePickerIconClick - Hàm xử lý click icon date picker.
 * @param {Function} props.onSearchButtonAction - Hàm xử lý click nút tìm kiếm.
 * @param {Array} props.locationTypeheadResults - Kết quả gợi ý địa điểm.
 * @param {Function} props.setisDatePickerVisible - Hàm set trạng thái hiển thị date picker.
 * @returns {JSX.Element} - Component HeroCover.
 */
const HeroCover = (props) => {
  const {
    locationInputValue,
    numGuestsInputValue,
    isDatePickerVisible,
    onLocationChangeInput,
    onNumGuestsInputChange,
    dateRange,
    onDateChangeHandler,
    onDatePickerIconClick,
    onSearchButtonAction,
    locationTypeheadResults,
    setisDatePickerVisible,
  } = props;
  return (
    <div className="bg-brand min-h-[400px] md:min-h-72 lg:min-h-60 text-slate-100">
      <div className="hero-content__container flex flex-col items-center container mx-auto px-2 md:px-0">
        <></>
        <div className="hero-content__text py-4">
          <h3 className="text-4xl font-medium">
            Khám phá nơi lưu trú hoàn hảo của bạn trên toàn thế giới
          </h3>
          <p className="my-1">
            Nhập ngày của bạn để xem giá mới nhất và bắt đầu hành trình
            thư giãn và phiêu lưu ngay hôm nay.
          </p>
        </div>
        <GlobalSearchBox
          locationInputValue={locationInputValue}
          locationTypeheadResults={locationTypeheadResults}
          numGuestsInputValue={numGuestsInputValue}
          isDatePickerVisible={isDatePickerVisible}
          setisDatePickerVisible={setisDatePickerVisible}
          onLocationChangeInput={onLocationChangeInput}
          onNumGuestsInputChange={onNumGuestsInputChange}
          dateRange={dateRange}
          onDateChangeHandler={onDateChangeHandler}
          onDatePickerIconClick={onDatePickerIconClick}
          onSearchButtonAction={onSearchButtonAction}
        />
      </div>
    </div>
  );
};

export default HeroCover;

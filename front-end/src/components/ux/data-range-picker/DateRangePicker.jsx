import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { DateRange } from 'react-date-range';
import { formatDate } from 'utils/date-helpers';
import useOutsideClickHandler from 'hooks/useOutsideClickHandler';

/**
 * Component DateRangePicker
 * Hiển thị bộ chọn khoảng thời gian với lịch.
 *
 * @param {Object} props - Props của component.
 * @param {boolean} props.isDatePickerVisible - Trạng thái hiển thị của bộ chọn ngày.
 * @param {Function} props.onDatePickerIconClick - Hàm xử lý khi click vào icon lịch.
 * @param {Function} props.onDateChangeHandler - Hàm xử lý khi thay đổi ngày.
 * @param {Array} props.dateRange - Khoảng thời gian đã chọn.
 * @param {Function} props.setisDatePickerVisible - Hàm cập nhật trạng thái hiển thị.
 * @param {string} props.inputStyle - Kiểu dáng của trường nhập liệu.
 * @param {Date} props.minDate - Ngày tối thiểu có thể chọn.
 * @returns {JSX.Element} Component DateRangePicker
 */
const inputSyleMap = {
  SECONDARY: 'stay-booker__input--secondary',
  DARK: 'stay-booker__input--dark',
};

const DateRangePicker = (props) => {
  const {
    isDatePickerVisible,
    onDatePickerIconClick,
    onDateChangeHandler,
    dateRange,
    setisDatePickerVisible,
    inputStyle,
    minDate
  } = props;

  const wrapperRef = useRef();
  useOutsideClickHandler(wrapperRef, () => setisDatePickerVisible(false));

  // Format dates for display
  const formattedStartDate = dateRange[0].startDate
    ? formatDate(dateRange[0].startDate)
    : 'Nhận phòng';
  const formattedEndDate = dateRange[0].endDate
    ? formatDate(dateRange[0].endDate)
    : 'Trả phòng';

  return (
    <div className="relative flex" data-testid="date-range-picker">
      <input
        className={`${
          inputStyle
            ? inputSyleMap[inputStyle]
            : 'stay-booker__input--secondary'
        } stay-booker__input px-8 py-2 w-[50%]`}
        type="text"
        value={formattedStartDate}
        onFocus={onDatePickerIconClick}
        readOnly
      ></input>
      <FontAwesomeIcon
        icon={faCalendar}
        color="#074498"
        className="left-[18px] transform-center-y"
        onClick={onDatePickerIconClick}
      />
      <input
        className={`${
          inputStyle
            ? inputSyleMap[inputStyle]
            : '  stay-booker__input--secondary'
        } stay-booker__input px-8 py-2 w-[50%]`}
        type="text"
        value={formattedEndDate}
        onFocus={onDatePickerIconClick}
        readOnly
      ></input>
      <div ref={wrapperRef} className="">
        {isDatePickerVisible && (
          <DateRange
            editableDateInputs={true}
            onChange={onDateChangeHandler}
            moveRangeOnFirstSelection={true}
            ranges={dateRange}
            minDate={minDate}
            direction="horizontal"
            className={`sb__date-range-picker`}
          />
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;

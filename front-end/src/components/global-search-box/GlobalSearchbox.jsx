import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import Input from 'components/ux/input/Input';

/**
 * Component GlobalSearchBox
 * Hiển thị hộp tìm kiếm với trường nhập liệu cho địa điểm.
 * Bao gồm nút tìm kiếm để kích hoạt tìm kiếm dựa trên địa điểm đã nhập.
 *
 * @param {Object} props - Props của component.
 * @param {string} props.locationInputValue - Giá trị hiện tại của trường nhập địa điểm.
 * @param {Function} props.onLocationChangeInput - Callback cho thay đổi trường nhập địa điểm.
 * @param {Array} props.locationTypeheadResults - Kết quả gợi ý cho trường nhập địa điểm.
 * @param {Function} props.onSearchButtonAction - Callback cho sự kiện click nút tìm kiếm.
 */
const GlobalSearchBox = (props) => {
  const {
    locationInputValue,
    onLocationChangeInput,
    locationTypeheadResults,
    onSearchButtonAction,
  } = props;

  return (
    <div className="flex flex-wrap flex-col lg:flex-row hero-content__search-box">
      <Input
        size="sm"
        value={locationInputValue}
        typeheadResults={locationTypeheadResults}
        icon={faLocationDot}
        onChangeInput={onLocationChangeInput}
        placeholder="Nhập tên thành phố"
      />
      <button
        className="w-full md:w-auto sb__button--secondary bg-brand-secondary hover:bg-yellow-600 px-4 py-2 text-white"
        onClick={onSearchButtonAction}
      >
        TÌM KIẾM
      </button>
    </div>
  );
};

export default GlobalSearchBox;

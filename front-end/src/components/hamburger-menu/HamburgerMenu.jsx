import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import NavbarItems from 'components/navbar-items/NavbarItems';

/**
 * Component HamburgerMenu
 * Hiển thị menu hamburger với các liên kết điều hướng. Có thể bật/tắt hiển thị.
 * Menu chứa các liên kết đến Trang chủ, Khách sạn, Về chúng tôi, và tùy thuộc vào trạng thái xác thực,
 * một liên kết đến hồ sơ người dùng hoặc trang đăng nhập/đăng ký.
 *
 * @param {Object} props - Props của component.
 * @param {boolean} props.isVisible - Điều khiển hiển thị của menu hamburger.
 * @param {Function} props.onHamburgerMenuToggle - Hàm callback để bật/tắt hiển thị menu.
 * @param {boolean} props.isAuthenticated - Chỉ ra người dùng đã được xác thực hay chưa.
 */
const HamburgerMenu = (props) => {
  const { isVisible, onHamburgerMenuToggle, isAuthenticated } = props;

  return (
    <div
      data-testid="hamburger-menu"
      className={`bg-brand shadow-2xl z-20 ${
        isVisible ? 'fixed right-0 w-1/2 top-0 h-screen' : 'hidden'
      }`}
    >
      <div className="absolute right-5 top-2">
        <FontAwesomeIcon
          data-testid="menu-close__button"
          icon={faXmark}
          size="2x"
          color="#fff"
          onClick={onHamburgerMenuToggle}
        />
      </div>
      <ul className="list-none mt-12">
        <NavbarItems
          onHamburgerMenuToggle={onHamburgerMenuToggle}
          isAuthenticated={isAuthenticated}
        />
      </ul>
    </div>
  );
};

export default HamburgerMenu;

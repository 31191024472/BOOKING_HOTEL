import { Link, useNavigate, useLocation } from 'react-router-dom';
import DropdownButton from 'components/ux/dropdown-button/DropdownButton';
import { networkAdapter } from 'services/NetworkAdapter.js';
import { useContext } from 'react';
import { AuthContext } from 'contexts/AuthContext';
/**
 * Component hiển thị các mục điều hướng cho thanh điều hướng trên cả giao diện di động và máy tính.
 *
 * @param {Object} props - Props của component.
 * @param {boolean} props.isAuthenticated - Cờ chỉ ra người dùng đã được xác thực hay chưa.
 * @param {Function} props.onHamburgerMenuToggle - Hàm xử lý khi bật/tắt menu hamburger.
 */
const NavbarItems = ({ isAuthenticated, onHamburgerMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(AuthContext);

  /**
   * Xử lý hành động đăng xuất bằng cách gọi API đăng xuất và cập nhật trạng thái xác thực.
   */
  const handleLogout = async () => {
    await networkAdapter.post('api/users/logout');
    localStorage.removeItem('token');
    context.setIsAuthenticated(false);
    context.setUserDetails(null);
    context.triggerAuthCheck();
    console.log("context.isAuthenticated", context.isAuthenticated);
    navigate('/login');
  };

  const dropdownOptions = [
    { name: 'Hồ sơ', onClick: () => navigate('/user-profile') },
    { name: 'Đăng xuất', onClick: handleLogout },
  ];

  /**
   * Kiểm tra xem một đường dẫn có phải là đường dẫn hiện tại đang hoạt động hay không.
   *
   * @param {string} path - Đường dẫn cần kiểm tra.
   * @returns {boolean} - True nếu đường dẫn đang hoạt động, false nếu không.
   */
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to="/"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${
            isActive('/') && 'active-link'
          }`}
          onClick={onHamburgerMenuToggle}
        >
          Trang chủ
        </Link>
      </li>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to="/hotels"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${
            isActive('/hotels') && 'active-link'
          }`}
          onClick={onHamburgerMenuToggle}
        >
          Khách sạn
        </Link>
      </li>
      <li className="p-4 hover:bg-blue-900 md:hover:bg-brand">
        <Link
          to="/about-us"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${
            isActive('/about-us') && 'active-link'
          }`}
          onClick={onHamburgerMenuToggle}
        >
          Về chúng tôi
        </Link>
      </li>
      <li
        className={`${!isAuthenticated && 'p-4 hover:bg-blue-900 md:hover:bg-brand'}`}
      >
        {isAuthenticated ? (
          <DropdownButton triggerType="click" options={dropdownOptions} />
        ) : (
          <Link
            to="/login"
            className={`uppercase font-medium text-slate-100 hover-underline-animation ${
              isActive('/login') && 'active-link'
            }`}
            onClick={onHamburgerMenuToggle}
          >
            Đăng nhập/Đăng ký
          </Link>
        )}
      </li>
    </>
  );
};

export default NavbarItems;

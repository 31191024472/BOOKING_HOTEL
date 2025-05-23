import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from 'assests/logos/stay_booker_logo.png';
import HamburgerMenu from 'components/hamburger-menu/HamburgerMenu';
import DropdownButton from 'components/ux/dropdown-button/DropdownButton';
import {AuthContext} from 'contexts/AuthContext';
import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { networkAdapter } from 'services/NetworkAdapter';

const AdminNavbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onHamburgerMenuToggle = () => {
    setIsVisible(!isVisible);
  };
  const {
    isAuthenticated,
    setIsAuthenticated,
    setUserDetails,
    triggerAuthCheck,
  } = useContext(AuthContext);
  
  const handleLogout = async () => {
    await networkAdapter.post('api/users/logout');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserDetails(null);
    triggerAuthCheck();
    console.log("isAuthenticated", isAuthenticated);
    navigate('/login');
  };
  

  const dropdownOptions = [{ name: 'Đăng xuất', onClick: handleLogout }];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="relative flex flex-wrap justify-between items-center px-4 md:px-12 global-navbar__container bg-brand brand-divider-bottom shadow-md">
      <div className="flex">
        <Link to="/admin/dashboard">
          <img src={logo} alt="site logo" className="site-logo__img" />
        </Link>
      </div>
      <ul className="list-none hidden md:flex">
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
      </ul>
      <FontAwesomeIcon
        data-testid="menu-toggle__button"
        icon={faBars}
        size="2x"
        color="#fff"
        className="block md:hidden"
        onClick={onHamburgerMenuToggle}
      />
      <HamburgerMenu
        isVisible={isVisible}
        onHamburgerMenuToggle={onHamburgerMenuToggle}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};

export default AdminNavbar;

import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';

const PartnerNavbar = () => {
  const { userDetails, setIsAuthenticated, setUserDetails } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userDetails');
    localStorage.removeItem('isAuthenticated');
    setUserDetails(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">Partner Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Thông báo */}
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <FontAwesomeIcon icon={faBell} className="text-xl" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => navigate('/partner/profile')}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={faUser} className="text-xl" />
                <span className="hidden md:block">{userDetails?.fullName || 'Partner'}</span>
              </button>
            </div>

            <span className="text-gray-600">{userDetails?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PartnerNavbar; 
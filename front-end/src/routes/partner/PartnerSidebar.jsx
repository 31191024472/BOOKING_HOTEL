import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from 'contexts/AuthContext';

const PartnerSidebar = () => {
  const { userDetails } = useContext(AuthContext);

  const menuItems = [
    {
      path: '/partner',
      label: 'Tổng quan',
      icon: '📊'
    },
    {
      path: '/partner/hotels',
      label: 'Quản lý khách sạn',
      icon: '🏨'
    },
    {
      path: '/partner/rooms',
      label: 'Quản lý phòng',
      icon: '🛏️'
    },
    {
      path: '/partner/bookings',
      label: 'Quản lý đặt phòng',
      icon: '📅'
    },
    {
      path: '/partner/promotions',
      label: 'Quản lý khuyến mãi',
      icon: '🎁'
    },
    {
      path: '/partner/reports',
      label: 'Thống kê & Báo cáo',
      icon: '📈'
    },
    {
      path: '/partner/account',
      label: 'Quản lý tài khoản',
      icon: '👤'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Partner Dashboard</h2>
        <p className="text-sm text-gray-600">{userDetails?.email}</p>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive ? 'bg-gray-100 border-l-4 border-brand' : ''
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default PartnerSidebar; 
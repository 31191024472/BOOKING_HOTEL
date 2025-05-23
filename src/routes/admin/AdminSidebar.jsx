import { useState } from 'react';
import {
  FaBars,
  FaBed,
  FaBox,
  FaEnvelope,
  FaHotel,
  FaTachometerAlt,
  FaTimes,
  FaUsers,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen bg-gray-800 text-white transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } flex flex-col`}
    >
      {/* Header với nút Toggle bên phải */}
      <div className="p-3 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
        )}
        <button
          className="p-2 focus:outline-none text-xl hover:bg-gray-700 transition-all ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <FaBars /> : <FaTimes />}
        </button>
      </div>

      {/* Danh sách menu */}
      <ul className="space-y-2 flex-1">
        <li>
          <Link
            to="/admin/dashboard"
            className={`flex items-center p-3 rounded hover:bg-gray-700 transition-all ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <FaTachometerAlt className="text-lg" />
            {!isCollapsed && <span className="ml-2">Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/admin/users"
            className={`flex items-center p-3 rounded hover:bg-gray-700 transition-all ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <FaUsers className="text-lg" />
            {!isCollapsed && <span className="ml-2">Manage Users</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/admin/bookings"
            className={`flex items-center p-3 rounded hover:bg-gray-700 transition-all ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <FaBox className="text-lg" />
            {!isCollapsed && <span className="ml-2">Manage Bookings</span>}
          </Link>
        </li>
        {/* Thêm mục quản lý khách sạn */}
        <li>
          <Link
            to="/admin/hotels"
            className={`flex items-center p-3 rounded hover:bg-gray-700 transition-all ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <FaHotel className="text-lg" />
            {!isCollapsed && <span className="ml-2">Manage Hotels</span>}
          </Link>
        </li>
        {/* Thêm mục quản lý phòng */}
        <li>
          <Link
            to="/admin/rooms"
            className={`flex items-center p-3 rounded hover:bg-gray-700 transition-all ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <FaBed className="text-lg" />
            {!isCollapsed && <span className="ml-2">Manage Rooms</span>}
          </Link>
        </li>
        {/* Thêm mục tạo thông báo gửi email */}
        <li>
          <Link
            to="/admin/notifications"
            className={`flex items-center p-3 rounded hover:bg-gray-700 transition-all ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <FaEnvelope className="text-lg" />
            {!isCollapsed && (
              <span className="ml-2">Send Email Notifications</span>
            )}
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;

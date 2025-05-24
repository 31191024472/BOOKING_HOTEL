import { useState, useEffect } from 'react';
import { networkAdapter } from 'services/NetworkAdapter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHotel,
  faBed,
  faCalendarCheck,
  faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalRooms: 0,
    totalBookings: 0,
    totalRevenue: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await networkAdapter.get('/api/partner/dashboard');
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thống kê:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: 'Tổng số khách sạn',
      value: stats.totalHotels,
      icon: faHotel,
      color: 'bg-blue-500'
    },
    {
      title: 'Tổng số phòng',
      value: stats.totalRooms,
      icon: faBed,
      color: 'bg-green-500'
    },
    {
      title: 'Đặt phòng hôm nay',
      value: stats.totalBookings,
      icon: faCalendarCheck,
      color: 'bg-yellow-500'
    },
    {
      title: 'Doanh thu hôm nay',
      value: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(stats.totalRevenue),
      icon: faMoneyBillWave,
      color: 'bg-purple-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-800 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <FontAwesomeIcon icon={stat.icon} className="text-white text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Biểu đồ và báo cáo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Doanh thu theo thời gian
          </h2>
          {/* Thêm biểu đồ doanh thu ở đây */}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Tỷ lệ đặt phòng
          </h2>
          {/* Thêm biểu đồ tỷ lệ đặt phòng ở đây */}
        </div>
      </div>

      {/* Đặt phòng gần đây */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Đặt phòng gần đây
        </h2>
        {/* Thêm danh sách đặt phòng gần đây ở đây */}
      </div>
    </div>
  );
};

export default Dashboard; 
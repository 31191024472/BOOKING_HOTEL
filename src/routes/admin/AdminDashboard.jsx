import axios from 'axios';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'; // Import biểu đồ Line từ Chart.js
import { useNavigate, useSearchParams } from 'react-router-dom';

// Đăng ký các module cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams(); // Lấy query từ URL
  const [filter, setFilter] = useState(searchParams.get('filter') || 'day');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/admin/revenue?filter=${filter}`
        );
        setRevenueData(response.data.revenueData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu doanh thu', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [filter]);

  useEffect(() => {
    navigate(`?filter=day`, { replace: true });
  }, [navigate]);

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
    setSearchParams({ filter: newFilter }); // Cập nhật URL trên trình duyệt
    navigate(`?filter=${newFilter}`, { replace: true }); // Cập nhật URL nhưng không reload trang
  };

  // Biểu đồ
  const chartData = {
    labels: revenueData.map((entry) => {
      if (filter === 'day') {
        return `${entry._id.day}-${entry._id.month}-${entry._id.year}`;
      } else if (filter === 'month') {
        return `${entry._id.month}-${entry._id.year}`;
      } else if (filter === 'year') {
        return `${entry._id.year}`;
      }
    }),
    datasets: [
      {
        label: 'Doanh thu',
        data: revenueData.map((entry) => entry.totalRevenue),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">
        📊 Thống kê doanh thu đặt phòng
      </h2>

      {/* Bộ lọc */}
      <div className="mb-4">
        <label className="mr-2">Lọc theo:</label>
        <select
          value={filter}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="day">Ngày</option>
          <option value="month">Tháng</option>
          <option value="year">Năm</option>
        </select>
      </div>

      {/* Biểu đồ doanh thu */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : revenueData.length > 0 ? (
        <div className="mb-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Line data={chartData} />
        </div>
      ) : (
        <p>Không có dữ liệu doanh thu.</p>
      )}

      {/* Bảng doanh thu với khả năng cuộn */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : revenueData.length > 0 ? (
        <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Thời gian</th>
                <th className="border p-2">Doanh thu (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.map((entry, index) => (
                <tr key={index} className="border">
                  <td className="p-2">
                    {entry._id.year}-
                    {entry._id.month?.toString().padStart(2, '0') || ''}
                    {entry._id.day
                      ? `-${entry._id.day.toString().padStart(2, '0')}`
                      : ''}
                  </td>
                  <td className="p-2">
                    {entry.totalRevenue.toLocaleString()} VNĐ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Không có dữ liệu doanh thu.</p>
      )}
    </div>
  );
};

export default AdminDashboard;

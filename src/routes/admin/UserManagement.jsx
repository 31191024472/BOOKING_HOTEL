import axios from 'axios';
import { useEffect, useState } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
    dateOfBirth: '',
    password: '',
    countryId: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchCountries();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách user:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/admin/countries'
      ); // API lấy danh sách quốc gia
      setCountries(response.data.countries);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách quốc gia:', error);
    }
  };

  const openModal = (user = null) => {
    setShowModal(true);
    if (user) {
      setCurrentUser(user);
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        password: '', // Reset password khi mở modal cập nhật
        countryId: user.countryId ? user.countryId._id : '',
      });
    } else {
      setCurrentUser(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'user',
        dateOfBirth: '',
        password: '', // Khi thêm mới, password cũng được reset
        countryId: '',
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log('Dữ liệu gửi đi:', formData);
    try {
      if (currentUser) {
        await axios.put(
          `http://localhost:5000/api/admin/users/${currentUser._id}`,
          formData
        );
      } else {
        await axios.post('http://localhost:5000/api/admin/users', formData);
      }
      fetchUsers();
      closeModal();
    } catch (error) {
      console.error('Lỗi khi lưu user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa user này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Lỗi khi xóa user:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>
      <button
        onClick={() => openModal()}
        className="bg-green-500 text-white px-4 py-2 mb-4 rounded-md"
      >
        + Thêm User
      </button>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Họ</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">SĐT</th>
            <th className="border p-2">Vai trò</th>
            <th className="border p-2">Ngày sinh</th>
            <th className="border p-2">Quốc tịch</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="border p-2">{user.firstName}</td>
              <td className="border p-2">{user.lastName}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.phone}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">
                {user.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString('en-GB') // Sử dụng 'en-GB' để định dạng dd/mm/yyyy
                  : '-'}
              </td>
              <td className="border p-2">
                {user.countryId ? user.countryId.name : 'Chưa chọn'}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => openModal(user)}
                  className="bg-blue-500 text-white px-2 py-1 rounded-md"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h3 className="text-xl font-bold mb-4">
              {currentUser ? 'Cập nhật User' : 'Thêm User'}
            </h3>

            <input
              type="text"
              name="firstName"
              placeholder="Họ"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Tên"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <select
              name="countryId"
              value={formData.countryId}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="">Chọn quốc gia</option>
              {countries.map((country) => (
                <option key={country._id} value={country._id}>
                  {country.name}
                </option>
              ))}
            </select>
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                {currentUser ? 'Cập nhật' : 'Thêm'}
              </button>
              <button
                onClick={closeModal}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

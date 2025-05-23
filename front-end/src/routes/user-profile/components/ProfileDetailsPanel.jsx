import React, { useState, useEffect } from 'react';
import Toast from 'components/ux/toast/Toast';
import { networkAdapter } from 'services/NetworkAdapter';
import Select from 'react-select';

/**
 * Hiển thị bảng thông tin chi tiết hồ sơ người dùng.
 * @component
 * @param {Object} props - Các props của component.
 * @param {Object} props.userDetails - Thông tin chi tiết của người dùng.
 * @returns {JSX.Element} Component đã được render.
 * */
const ProfileDetailsPanel = ({ userDetails }) => {
  // State để quản lý chế độ chỉnh sửa và thông tin người dùng
  const [isEditMode, setIsEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [nationality, setNationality] = useState('');
  const [countries, setCountries] = useState([]);

  const [toastMessage, setToastMessage] = useState('');

  const clearToastMessage = () => {
    setToastMessage('');
  };

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCancelClick = () => {
    setIsEditMode(!isEditMode);
  };

  /**
   * Xử lý sự kiện click nút lưu.
   * Cập nhật thông tin người dùng và tắt chế độ chỉnh sửa.
   * */
  const handleSaveClick = async () => {
    // Kiểm tra xem state mới có khác với state cũ không
    if (
      firstName === userDetails.firstName &&
      lastName === userDetails.lastName &&
      phoneNumber === userDetails.phone &&
      nationality === userDetails.country &&
      dateOfBirth === userDetails.dateOfBirth // Kiểm tra nếu ngày tháng năm sinh cũng không thay đổi
    ) {
      setIsEditMode(false);
      return;
    }

    const updatedUserDetails = {
      firstName,
      lastName,
      phone: phoneNumber,
      country: nationality,
      dateOfBirth,
    };

    // Gọi API để cập nhật thông tin người dùng
    const response = await networkAdapter.patch(
      '/api/users/update-profile',
      updatedUserDetails
    );
    console.log("Updated details gửi lên:", updatedUserDetails);
    console.log("Response từ server:", response);
    
    if (response) {
      setToastMessage({
        type: 'success',
        message: "Cập nhật thông tin thành công",
      });
    } else {
      // Khôi phục về trạng thái ban đầu
      setFirstName(userDetails.firstName);
      setLastName(userDetails.lastName);
      setPhoneNumber(userDetails.phone);
      setNationality(userDetails.country);
      setDateOfBirth(userDetails.dateOfBirth); // Khôi phục lại ngày tháng năm sinh nếu có lỗi
      setToastMessage({
        type: 'error',
        message: 'Oops, đã xảy ra lỗi. Vui lòng thử lại sau.',
      });
    }

    setIsEditMode(false);
  };


  // Effect để thiết lập trạng thái ban đầu của thông tin người dùng
  useEffect(() => {
    if (userDetails) {
      setFirstName(userDetails.firstName || '');
      setLastName(userDetails.lastName || '');
      setEmail(userDetails.email || '');
      setPhoneNumber(userDetails.phone || '');
      setNationality(userDetails.countryId || '');
      setIsEmailVerified(userDetails.isEmailVerified || '');
      setIsPhoneVerified(userDetails.isPhoneVerified || '');
      setDateOfBirth(userDetails.dateOfBirth || '');
    }
  }, [userDetails]);

  useEffect(() => {
    const fetchCountries = async () => {
      const countriesData = await networkAdapter.get('/api/misc/countries');
      if (countriesData && countriesData.data) {
        console.log('countriesData', countriesData.data);
        const mappedValues = countriesData.data.elements.map((country) => ({
          label: country.name,
          value: country._id,
        }));
        setCountries(mappedValues);
      }
    };
    fetchCountries();
  }, []);

  return (
    <div className="bg-white shadow sm:rounded-lg flex flex-col">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-xl leading-6 font-medium text-gray-900">
          Thông tin cá nhân
        </h3>
        <p className="mt-1 max-w-2xl text-gray-500">
          Cập nhật thông tin của bạn để đảm bảo liên lạc và dịch vụ suôn sẻ
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {isEditMode ? (
            // Các trường có thể chỉnh sửa
            <>
              <TextField
                label="Tên"
                value={firstName}
                onChange={setFirstName}
              />
              <TextField
                label="Họ"
                value={lastName}
                onChange={setLastName}
              />
              <TextField
                label="Số điện thoại"
                type="tel"
                value={phoneNumber}
                onChange={setPhoneNumber}
              />
              <TextField
                label="Ngày sinh"
                type="date"
                value={dateOfBirth}
                onChange={setDateOfBirth}
              />
              <div className="relative">
                <TextField
                  label="Quốc tịch"
                  value={nationality}
                  onChange={setNationality}
                  isSelectable={true}
                  selectableData={countries}
                />
              </div>
            </>
          ) : (
            // Các trường hiển thị
            <>
              <DisplayField label="Tên" value={firstName} />
              <DisplayField label="Họ" value={lastName} />
              <DisplayField
                label="Địa chỉ email"
                value={email}
                verified={isEmailVerified}
              />
              <DisplayField
                label="Số điện thoại"
                value={phoneNumber || 'Thêm số điện thoại của bạn'}
                verified={isPhoneVerified}
              />
              <DisplayField
                label="Ngày sinh"
                value={
                  dateOfBirth
                    ? new Date(dateOfBirth).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                    : 'Nhập ngày sinh của bạn'
                }
              />

              <DisplayField
                label="Quốc tịch"
                value={
                  // Tìm quốc gia trong danh sách countries dựa trên ID
                  countries.find((country) => country.value === nationality)?.label || 'Chưa có quốc tịch'
                }
              />

            </>
          )}
        </dl>
      </div>
      <div className="flex justify-between px-4 py-3 bg-gray-50 text-right sm:px-6">
        {isEditMode ? (
          <>
            <button
              onClick={handleCancelClick}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveClick}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Lưu
            </button>
          </>
        ) : (
          <button
            onClick={handleEditClick}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Chỉnh sửa
          </button>
        )}
      </div>
      {toastMessage && (
        <div className="m-2">
          <Toast
            type={toastMessage.type}
            message={toastMessage.message}
            dismissError={clearToastMessage}
          />
        </div>
      )}
    </div>
  );
};

const DisplayField = ({ label, value, verified }) => (
  <div
    className={`bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${verified ? 'bg-gray-50' : ''
      }`}
  >
    <dt className="font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">
      {value}{' '}
      {verified && <span className="text-green-500 font-medium">Đã xác minh</span>}
    </dd>
  </div>
);

const TextField = ({
  label,
  value,
  onChange,
  type = 'text',
  isSelectable,
  selectableData,
}) => (
  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
    <dt className="font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 sm:mt-0 sm:col-span-2">
      {isSelectable ? (
        <Select
          value={selectableData.find((option) => option.value === value)}
          onChange={(option) => onChange(option.value)}
          options={selectableData}
          className="basic-single"
          classNamePrefix="select"
          placeholder="Chọn quốc tịch"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="shadow-sm focus:ring-brand focus:border-brand block w-full sm:text-sm border-gray-300 rounded-md"
        />
      )}
    </dd>
  </div>
);

export default ProfileDetailsPanel;

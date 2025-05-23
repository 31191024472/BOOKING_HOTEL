import { useState } from 'react';

/* PaymentMethodsPanel
 * Hiển thị danh sách các phương thức thanh toán với khả năng chỉnh sửa và lưu thay đổi.
 * @param {Array} paymentMethods - Mảng các phương thức thanh toán.
 * @param {Function} setPaymentMethods - Hàm để cập nhật các phương thức thanh toán.
 * @returns {JSX.Element} - Component PaymentMethodsPanel.
 */
const PaymentMethodsPanel = ({
  userPaymentMethodsData,
  setUserPaymentMethodsData,
}) => {
  const [editIndex, setEditIndex] = useState(-1); // -1 nghĩa là không có chỉnh sửa nào đang hoạt động
  const [currentEdit, setCurrentEdit] = useState({});

  const handleEdit = (index) => {
    setEditIndex(index);
    setCurrentEdit({ ...userPaymentMethodsData.data[index] });
  };

  const handleCancel = () => {
    setEditIndex(-1);
  };

  const handleSave = () => {
    const updatedPaymentMethods = [...userPaymentMethodsData.data];
    updatedPaymentMethods[editIndex] = currentEdit;
    setUserPaymentMethodsData({ data: updatedPaymentMethods });
    setEditIndex(-1);
  };

  const handleChange = (e, field) => {
    setCurrentEdit({ ...currentEdit, [field]: e.target.value });
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {userPaymentMethodsData.data?.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          Bạn chưa có phương thức thanh toán nào được lưu.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {userPaymentMethodsData.data.map((method, index) => (
            <li
              key={index}
              className="px-4 py-4 flex items-center justify-between sm:px-6"
            >
              {editIndex === index ? (
                // Các trường có thể chỉnh sửa
                <div className="flex-grow">
                  <input
                    type="text"
                    value={currentEdit.cardType}
                    onChange={(e) => handleChange(e, 'cardType')}
                    className="text-lg border px-2 py-1 my-2 font-medium text-gray-900 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={currentEdit.cardNumber}
                    onChange={(e) => handleChange(e, 'cardNumber')}
                    className="text-sm border px-2 py-1 my-2 text-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={currentEdit.expiryDate}
                    onChange={(e) => handleChange(e, 'expiryDate')}
                    className="text-sm border px-2 py-1 my-2 text-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              ) : (
                // Các trường hiển thị
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-gray-900">
                    {method.cardType}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Kết thúc bằng {method.cardNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    Hết hạn {method.expiryDate}
                  </p>
                </div>
              )}

              {/* <div className="ml-4 flex-shrink-0">
                {editIndex === index ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-brand hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEdit(index)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-brand  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentMethodsPanel;

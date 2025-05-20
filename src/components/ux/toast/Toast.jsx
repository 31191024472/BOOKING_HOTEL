import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Component Toast
 * Hiển thị thông báo toast với nút đóng.
 *
 * @param {Object} props - Props của component.
 * @param {string} props.type - Loại thông báo toast.
 * @param {string} props.message - Nội dung thông báo hiển thị trong toast.
 * @param {Function} props.dismissError - Hàm để đóng thông báo toast.
 */
const Toast = ({ type, message, dismissError }) => {
  const typeToClassMap = {
    error: 'bg-red-100 border-l-4 border-red-500 text-red-700',
    success: 'bg-green-100 border-l-4 border-green-500 text-green-700 my-2',
    warning: 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700',
  };
  return (
    <div
      className={`${typeToClassMap[type]} p-4 mb-4 flex justify-between`}
      data-testid="toast__outlet"
    >
      <p data-testid="toast__message">{message}</p>
      <FontAwesomeIcon
        onClick={() => dismissError()}
        className="text-red-500 hover:text-red-700 ml-2"
        icon={faXmark}
        size="lg"
        data-testid="toast__dismiss"
      />
    </div>
  );
};

export default Toast;

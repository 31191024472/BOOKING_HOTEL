import { useEffect } from 'react';

/**
 * Hook tùy chỉnh kích hoạt một hàm callback khi sự kiện click xảy ra bên ngoài một phần tử được chỉ định.
 *
 * @param {React.RefObject} ref - Đối tượng ref React được gắn vào phần tử cần theo dõi click bên ngoài.
 * @param {Function} onOutsideClick - Hàm callback được thực thi khi phát hiện click bên ngoài.
 */
const useOutsideClickHandler = (ref, onOutsideClick) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick(event);
      }
    };

    // Gắn trình lắng nghe sự kiện
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Gỡ bỏ trình lắng nghe sự kiện khi dọn dẹp
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onOutsideClick]);
};

export default useOutsideClickHandler;

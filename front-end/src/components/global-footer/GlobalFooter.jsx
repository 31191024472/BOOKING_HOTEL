import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Component FooterLink
 * Component con của GlobalFooter, hiển thị một liên kết trong footer.
 *
 * @param {Object} props - Props của component.
 * @param {string} props.to - Đường dẫn đích của liên kết.
 * @param {string} props.label - Văn bản hiển thị của liên kết.
 * @returns {JSX.Element} Component FooterLink
 */
const FooterLink = ({ to, label }) => (
  <Link
    to={to}
    className="block text-slate-700 hover:text-brand transition-colors duration-300"
  >
    {label}
  </Link>
);

/**
 * Component GlobalFooter
 * Hiển thị chân trang toàn cục của ứng dụng.
 * Bao gồm thông tin công ty, hỗ trợ, bản tin và thông tin bản quyền.
 * Tự động chuyển đổi giữa giao diện desktop và mobile dựa trên kích thước màn hình.
 *
 * @returns {JSX.Element} Component GlobalFooter
 */
const GlobalFooter = () => {
  return (
    <footer className="bg-slate-50 text-slate-700 mt-6">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2">Thông tin công ty</h4>
            <FooterLink to="/about-us" label="Về chúng tôi" />
            <FooterLink to="/" label="Liên hệ" />
            <FooterLink to="/" label="Chính sách bảo mật" />
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2">Hỗ trợ</h4>
            <FooterLink to="/" label="Câu hỏi thường gặp" />
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2">Bản tin</h4>
            <p>Cập nhật những xu hướng mới nhất</p>
            <form>
              <input
                type="email"
                placeholder="Nhập email"
                className="p-2 rounded"
              />
              <button className="ml-2 p-2 bg-brand text-white rounded">
                Đăng ký
              </button>
            </form>
          </div>
        </div>
        <div className="text-center mt-10">
          <p>Thiết kế và phát triển bởi StayBooker</p>
          <p>
            &copy; {new Date().getFullYear()} StayBooker. Bản quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;

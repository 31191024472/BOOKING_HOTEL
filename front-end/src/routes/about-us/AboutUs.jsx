import React from 'react';

/**
 * Component Giới thiệu về chúng tôi
 * @returns {jsx}
 */
const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-brand mb-2">Về Chúng Tôi</h1>
      <p className="text-lg mb-8">
        Chào mừng bạn đến với <span className="text-brand">VIET STAY</span> – nền tảng đặt phòng khách sạn hàng đầu tại Việt Nam. 
        Chúng tôi mang đến trải nghiệm đặt phòng nhanh chóng, tiện lợi và đáng tin cậy, giúp bạn tận hưởng chuyến đi một cách trọn vẹn.
      </p>

      <h2 className="text-3xl font-extrabold text-brand mb-2">Sứ Mệnh Của Chúng Tôi</h2>
      <p className="text-lg mb-8">
        <span className="text-brand">VIET STAY</span> hướng đến việc kết nối du khách với những chỗ nghỉ lý tưởng trên khắp Việt Nam, 
        từ những khu nghỉ dưỡng cao cấp, khách sạn boutique sang trọng đến homestay ấm cúng tại những vùng quê yên bình.
      </p>

      <h2 className="text-3xl font-extrabold text-brand mb-2">Tại Sao Chọn Chúng Tôi?</h2>
      <ul className="list-disc ml-6 mb-8">
        <li className="text-lg mb-3">
          <strong>Hệ thống khách sạn đa dạng:</strong> Chúng tôi hợp tác với hàng ngàn khách sạn trên khắp Việt Nam, mang đến nhiều lựa chọn cho mọi nhu cầu.
        </li>
        <li className="text-lg mb-3">
          <strong>Đặt phòng dễ dàng, thanh toán linh hoạt:</strong> Chỉ với vài thao tác đơn giản, bạn có thể đặt phòng và thanh toán một cách an toàn qua nhiều phương thức khác nhau.
        </li>
        <li className="text-lg mb-3">
          <strong>Ưu đãi hấp dẫn:</strong> Chúng tôi thường xuyên cập nhật các chương trình khuyến mãi và giảm giá đặc biệt cho khách hàng thân thiết.
        </li>
        <li className="text-lg mb-3">
          <strong>Hỗ trợ 24/7:</strong> Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.
        </li>
      </ul>

      <h2 className="text-3xl font-extrabold text-brand mb-2">Liên Hệ</h2>
      <p className="text-lg mb-4">
        Cần hỗ trợ hoặc có câu hỏi? Đội ngũ của chúng tôi luôn sẵn sàng giúp bạn.
        Hãy liên hệ qua email{' '}
        <a
          className="text-brand hover:underline"
          href="mailto:support@vietstay.com"
        >
          support@vietstay.com
        </a>
        .
      </p>
      <p className="text-lg">
        Cảm ơn bạn đã tin tưởng và lựa chọn <span className="text-brand">VIET STAY</span>.
        Chúc bạn có những trải nghiệm lưu trú tuyệt vời!
      </p>
    </div>
  );
};

export default AboutUs;
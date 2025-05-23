import connectDB from "../config/db.js";
import Booking from "../models/Booking.js";
import City from "../models/City.js";
import Country from "../models/Country.js";
import Discount from "../models/Discount.js";
import Hotel from "../models/Hotel.js";
import Notification from "../models/Notification.js";
import PaymentMethod from "../models/PaymentMethod.js";
import Review from "../models/Review.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

const seedDatabase = async () => {
  await connectDB();

  try {
    // Xóa dữ liệu cũ (nếu cần)
    await User.deleteMany();
    await Country.deleteMany();
    await City.deleteMany();
    await Hotel.deleteMany();
    await Room.deleteMany();
    await PaymentMethod.deleteMany();
    await Discount.deleteMany();
    await Review.deleteMany();
    await Booking.deleteMany();
    await Notification.deleteMany();

    // Thêm Quốc Gia
    const vietnam = await Country.create({ name: "Vietnam", code: "VN" });
    const usa = await Country.create({ name: "United States", code: "US" });
    const canada = await Country.create({ name: "Canada", code: "CA" });
    const uk = await Country.create({ name: "United Kingdom", code: "GB" });
    const france = await Country.create({ name: "France", code: "FR" });
    const germany = await Country.create({ name: "Germany", code: "DE" });
    const japan = await Country.create({ name: "Japan", code: "JP" });
    const southKorea = await Country.create({
      name: "South Korea",
      code: "KR",
    });
    const australia = await Country.create({ name: "Australia", code: "AU" });
    const india = await Country.create({ name: "India", code: "IN" });

    // Thêm Thành phố
    const hanoi = await City.create({ name: "Hà Nội", code: "HN", image: "" });
    const danang = await City.create({
      name: "Đà Nẵng",
      code: "DN",
      image: "",
    });

    // Thêm Người dùng
    const user1 = await User.create({
      firstName: "Nguyen",
      lastName: "An",
      email: "nguyenan@example.com",
      password_hash: "hashed_password",
      phone: "0987654321",
      role: "user",
      countryId: vietnam._id,
    });

    const admin = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password_hash: "hashed_password",
      role: "admin",
      countryId: usa._id,
    });

    // Thêm Khách Sạn
    const hotel1 = await Hotel.create({
      hotelCode: 1001,
      propertyType: "Hotel",
      title: "Hotel Hanoi Luxury",
      subtitle: "Khách sạn 5 sao trung tâm Hà Nội",
      description: "Khách sạn cao cấp với tiện nghi hiện đại",
      cityId: hanoi._id,
      benefits: ["Free Wifi", "Hồ bơi", "Bữa sáng miễn phí"],
      ratings: 4.5,
      imageUrls: [],
    });

    // Thêm Phòng
    const room1 = await Room.create({
      hotelId: hotel1._id,
      roomType: "Deluxe",
      description: "Phòng rộng rãi với tầm nhìn đẹp",
      pricePerNight: 1500000,
      maxOccupancy: 2,
      bedType: "King",
      amenities: ["TV", "Điều hòa", "Mini bar"],
      quantity: 5,
      imageUrls: [],
    });

    // Thêm phương thức thanh toán
    const paymentMethod1 = await PaymentMethod.create({
      userId: user1._id,
      cardType: "Visa",
      cardNumber: "4111111111111111",
      expiryDate: "12/25",
    });

    // Thêm mã giảm giá
    const discount1 = await Discount.create({
      code: "SUMMER2025",
      discount_percentage: 10,
      valid_from: new Date("2025-06-01"),
      valid_until: new Date("2025-08-31"),
    });

    // Thêm Đánh giá
    const review1 = await Review.create({
      hotelId: hotel1._id,
      userId: user1._id,
      reviewerName: "Nguyen An",
      rating: 5,
      review: "Khách sạn tuyệt vời, dịch vụ rất tốt!",
      verified: true,
    });

    // Thêm Đặt Phòng
    const booking1 = await Booking.create({
      userId: user1._id,
      hotelCode: 1001,
      roomId: room1._id,
      checkInDate: new Date("2025-04-01"),
      checkOutDate: new Date("2025-04-05"),
      quantity: 1,
      totalPrice: 6000000,
      paymentMethodId: paymentMethod1._id,
      status: "Confirmed",
    });

    // Thêm Thông báo
    await Notification.create({
      userId: user1._id,
      title: "Xác nhận đặt phòng",
      message: "Đặt phòng của bạn đã được xác nhận!",
      type: "booking",
    });

    console.log("Dữ liệu đã được thêm vào MongoDB!");
    process.exit();
  } catch (error) {
    console.error("Lỗi khi thêm dữ liệu:", error);
    process.exit(1);
  }
};

seedDatabase();

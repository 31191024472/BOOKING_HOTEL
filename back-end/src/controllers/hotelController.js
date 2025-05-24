import HotelService from '../services/HotelService.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Hotel from '../models/Hotel.js';

// Lấy tất cả khách sạn
export const getHotels = async (req, res) => {
    try {

        const {
            city,
            star_ratings,
            property_type,
            page = 1,
            limit = 5
        } = req.query;

        // 1. Parse và validate dữ liệu đầu vào
        let parsedStarRatings = [];
        let parsedPropertyType = [];

        // Chỉ parse khi có params
        if (star_ratings) {
            try {
                parsedStarRatings = JSON.parse(star_ratings);
                if (!Array.isArray(parsedStarRatings)) {
                    parsedStarRatings = [parsedStarRatings];
                }
            } catch (e) {
                console.error("Lỗi khi parse star_ratings:", e);
                return res.status(400).json({
                    success: false,
                    errors: ["Định dạng star_ratings không hợp lệ"]
                });
            }
        }

        if (property_type) {
            try {
                parsedPropertyType = JSON.parse(property_type);
                if (!Array.isArray(parsedPropertyType)) {
                    parsedPropertyType = [parsedPropertyType];
                }
            } catch (e) {
                console.error("Lỗi khi parse property_type:", e);
                return res.status(400).json({
                    success: false,
                    errors: ["Định dạng property_type không hợp lệ"]
                });
            }
        }

        // 2. Validate các tham số
        if (page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                errors: ["Số trang và giới hạn phải lớn hơn 0"]
            });
        }

        // 3. Tính toán skip
        const skip = (page - 1) * limit;

        // 4. Tạo object filters - chỉ thêm các điều kiện khi có params
        const filters = {};
        if (city) filters.city = city.toLowerCase();
        if (parsedStarRatings.length > 0) filters.star_ratings = parsedStarRatings;
        if (parsedPropertyType.length > 0) filters.property_type = parsedPropertyType;

        // 5. Gọi service để lấy dữ liệu
        const result = await HotelService.getHotels(filters, skip, limit);

        // 6. Trả về kết quả
        return res.json({
            success: true,
            data: result?.hotels || [],
            pagination: {
                currentPage: result?.page || 1,
                totalPages: result?.totalPages || 1,
                totalItems: result?.total || 0,
                limit: result?.limit || limit
            }
        });
    } catch (error) {
        console.error('Error in getHotels controller:', error);
        return res.status(500).json({
            success: false,
            errors: ["Lỗi server khi lấy danh sách khách sạn"]
        });
    }
};

// Lấy khách sạn theo hotelCode
export const getHotelByCode = async (req, res) => {
    try {
        const hotelCode = parseInt(req.params.hotelCode, 10);
        if (isNaN(hotelCode)) {
            return res.status(400).json({ 
                success: false, 
                message: "Mã khách sạn không hợp lệ" 
            });
        }

        const hotel = await HotelService.findByHotelCode(hotelCode);
        if (!hotel) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy khách sạn" 
            });
        }

        res.json({ 
            success: true, 
            data: hotel 
        });
    } catch (error) {
        console.error("❌ Error in getHotelByCode:", error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server khi lấy thông tin khách sạn" 
        });
    }
};

// Tạo khách sạn mới
export const createHotel = async (req, res) => {
    try {
        const hotel = await HotelService.createHotel(req.body);
        res.status(201).json({ success: true, data: hotel });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Cập nhật khách sạn theo hotelCode
export const updateHotel = async (req, res) => {
    try {
        const hotelCode = parseInt(req.params.hotelCode, 10);
        if (isNaN(hotelCode)) {
            return res.status(400).json({ success: false, message: "Invalid hotel code format" });
        }

        const hotel = await HotelService.updateHotel(hotelCode, req.body);
        if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

        res.json({ success: true, data: hotel });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Xóa khách sạn theo hotelCode
export const deleteHotel = async (req, res) => {
    try {
        const hotelCode = parseInt(req.params.hotelCode, 10);
        if (isNaN(hotelCode)) {
            return res.status(400).json({ success: false, message: "Invalid hotel code format" });
        }

        const hotel = await HotelService.deleteHotel(hotelCode);
        if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

        res.json({ success: true, message: "Hotel deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy khách sạn gần nhất
export const getNearbyHotels = async (req, res) => {
    try {
        const cityId = req.query.cityId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const response = await HotelService.getNearbyHotels(cityId, page, limit);
        
        if (!response.success) {
            return res.status(404).json(response);
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("❌ Error in getNearbyHotels:", error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server khi lấy danh sách khách sạn gần nhất" 
        });
    }
};

// Lấy danh sách thành phố có khách sạn
export const getAvailableCities = async (req, res) => {
    try {
        const cities = await HotelService.getAvailableCities();
        res.status(200).json({ success: true, data: cities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy các bộ lọc khách sạn
export const getHotelFilters = async (req, res) => {
    try {
        const filters = await HotelService.getHotelFilters();
        res.status(200).json({
            success: true,
            data: filters
        });
    } catch (error) {
        console.error("❌ Error in getHotelFilters:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy bộ lọc khách sạn"
        });
    }
};

// Lấy các điểm đến phổ biến
export const getPopularDestinations = async (req, res) => {
    try {
        const destinations = await HotelService.getPopularDestinations();
        res.status(200).json({
            success: true,
            data: { elements: destinations }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy đánh giá khách sạn
export const getHotelReview = async (req, res) => {
    try {
        const { hotelCode } = req.params;
        const { page = 1, limit = 5 } = req.query;

        const reviewsResult = await HotelService.getHotelReviews(hotelCode);
        const skip = (page - 1) * limit;
        const paginatedReviews = reviewsResult.reviews.slice(skip, skip + Number(limit));

        res.status(200).json({
            success: true,
            data: {
                elements: paginatedReviews,
            },
            metadata: {
                totalReviews: reviewsResult.total,
                averageRating: reviewsResult.averageRating,
                starCounts: reviewsResult.starCounts,
                currentPage: Number(page),
                totalPages: Math.ceil(reviewsResult.total / limit),
            }
        });
    } catch (error) {
        console.error("❌ Error in getHotelReview:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy thông tin chi tiết cho việc đặt phòng
export const getHotelBookingDetails = async (req, res) => {
    try {
        const { hotelCode } = req.params;
        const { checkIn, checkOut, numberOfGuests, numberOfRooms } = req.query;

        const response = await HotelService.getHotelBookingDetails(hotelCode, {
            checkIn,
            checkOut,
            numberOfGuests: parseInt(numberOfGuests),
            numberOfRooms: parseInt(numberOfRooms)
        });

        if (!response.success) {
            return res.status(404).json(response);
        }

        res.json(response);
    } catch (error) {
        console.error("❌ Error in getHotelBookingDetails:", error);
        res.status(500).json({ 
            success: false, 
            message: "Lỗi server khi lấy thông tin đặt phòng" 
        });
    }
};

// Thêm đánh giá khách sạn
export const addHotelReview = async (req, res) => {
    try {
        const { hotelCode } = req.params;
        const { rating, review } = req.body;
        const userId = req.user._id;

        // Kiểm tra hotelCode có hợp lệ không
        if (!hotelCode || isNaN(hotelCode)) {
            return res.status(400).json({
                success: false,
                message: "Mã khách sạn không hợp lệ"
            });
        }

        // Kiểm tra xem khách sạn có tồn tại không
        const hotel = await Hotel.findOne({ hotelCode: Number(hotelCode) });
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy khách sạn"
            });
        }

        // Kiểm tra xem user đã từng đặt phòng tại khách sạn này chưa
        const booking = await Booking.findOne({
            userId: userId,
            hotelId: String(hotelCode)
        });

        // Kiểm tra xem user đã đánh giá khách sạn này chưa
        const existingReview = await Review.findOne({
            userId: userId,
            hotelId: hotel._id
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "Bạn đã đánh giá khách sạn này rồi"
            });
        }

        // Tạo đánh giá mới
        const newReview = await Review.create({
            hotelId: hotel._id,
            userId: userId,
            rating,
            review,
            verified: !!booking // Nếu có booking thì verified = true, không thì false
        });

        // Cập nhật rating trung bình của khách sạn
        const reviews = await Review.find({ hotelId: hotel._id });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await Hotel.findByIdAndUpdate(hotel._id, {
            ratings: averageRating,
            totalReviews: reviews.length
        });

        res.status(201).json({
            success: true,
            message: "Đánh giá đã được thêm thành công",
            data: newReview
        });
    } catch (error) {
        console.error("❌ Error in addHotelReview:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi thêm đánh giá"
        });
    }
};
  
  
  
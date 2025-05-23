import express from 'express';
import RoomController from '../controllers/RoomController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Lấy danh sách phòng theo hotelId
router.get('/hotel/:hotelId', RoomController.getRoomsByHotelId);
// Lấy thông tin chi tiết một phòng
router.get('/:id', RoomController.getRoomById);
// Kiểm tra tính khả dụng của phòng
router.get('/:roomId/availability', RoomController.checkRoomAvailability);
// Các route yêu cầu xác thực
router.use(authMiddleware);
// Tạo phòng mới
router.post('/', RoomController.createRoom);
// Cập nhật thông tin phòng
router.put('/:id', RoomController.updateRoom);
// Xóa phòng
router.delete('/:id', RoomController.deleteRoom);

export default router; 
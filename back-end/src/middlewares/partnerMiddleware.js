import userRepository from "../repositories/userRepository.js";

const partnerMiddleware = async (req, res, next) => {
  try {
    // Kiểm tra xem user có role là partner không
    if (req.user.role !== 'partner') {
      return res.status(403).json({ 
        success: false, 
        message: "Không có quyền truy cập. Yêu cầu quyền partner." 
      });
    }

    // Kiểm tra trạng thái partner
    if (req.user.partnerInfo && req.user.partnerInfo.status !== 'approved') {
      return res.status(403).json({ 
        success: false, 
        message: "Tài khoản partner chưa được phê duyệt hoặc đã bị từ chối." 
      }); 
    }

    next();
  } catch (error) {
    console.error("🚨 Lỗi trong partnerMiddleware:", error);
    res.status(500).json({ 
      success: false, 
      message: "Lỗi server khi kiểm tra quyền partner" 
    });
  }
};

export default partnerMiddleware; 
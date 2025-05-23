import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Không có token hoặc sai định dạng" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("🚨 Lỗi trong authUser Middleware :", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;

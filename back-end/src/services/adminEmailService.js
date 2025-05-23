import dotenv from "dotenv";
import multer from "multer";
import nodemailer from "nodemailer";
import userRepository from "../repositories/adminUserRespository.js";

dotenv.config();

const upload = multer();
export const emailUploadMiddleware = upload.single("file");

export const sendPromotionalEmail = async (subject, message, file) => {
  try {
    // Lấy danh sách email của người dùng có role "user"
    const users = await userRepository.getUsersByRole("user");
    const emailList = users.map((user) => user.email);

    if (emailList.length === 0) {
      throw new Error("Không tìm thấy người dùng nào có email");
    }

    // Cấu hình transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Template email
    const emailTemplate = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #007BFF; color: white; padding: 20px;">
        <h2 style="margin: 0;">StayBooking - Thông Báo</h2>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <p style="font-size: 16px;">Xin chào,</p>
        <div style="font-size: 15px; line-height: 1.6;">
          ${message}
        </div>
      </div>

      <div style="padding: 20px; background-color: #f1f1f1; text-align: center; font-size: 13px; color: #777;">
        Bạn nhận được email này vì đã đăng ký tại StayBooking.<br />
        Nếu bạn không muốn nhận thêm, vui lòng bỏ đăng ký trong tài khoản.
      </div>
    </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailList,
      subject,
      html: emailTemplate,
      attachments: file
        ? [
            {
              filename: file.originalname,
              content: file.buffer,
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: `Email đã được gửi đến ${emailList.length} người dùng`,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

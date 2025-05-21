import * as emailService from "../services/adminEmailService.js";

export const sendPromotionalEmail = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const file = req.file;

    const response = await emailService.sendPromotionalEmail(
      subject,
      message,
      file
    );

    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

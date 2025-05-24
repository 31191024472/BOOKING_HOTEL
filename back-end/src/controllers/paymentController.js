import paymentServices from "../services/paymentServices.js";


// Lấy danh sách phương thức thanh toán
export const addPayment = async (req, res) => {
  try {
    const payment = await paymentServices.addPaymentMethod({
      ...req.body,
      user: req.user._id,
    });
    res.json({ success: true, payment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await paymentServices.getUserPaymentMethods(req.user._id);
    res.json({ success: true, payments });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

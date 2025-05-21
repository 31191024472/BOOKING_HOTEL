import revenueService from "../services/adminRevenueService.js";

export const getRevenueStatistics = async (req, res) => {
  try {
    const { filter } = req.query;

    if (!filter) {
      return res.status(400).json({
        success: false,
        message: "Filter is required",
      });
    }

    const revenueData = await revenueService.getFormattedRevenue(filter);

    res.json({ success: true, revenueData });
  } catch (error) {
    console.error("Lỗi thống kê doanh thu:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ",
      error: error.message,
    });
  }
};
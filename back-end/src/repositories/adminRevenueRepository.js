import Booking from "../models/Booking.js";

class BookingRepository {
  async getRevenueDataByFilter(filter) {
    let groupFormat;

    switch (filter) {
      case "day":
        groupFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        };
        break;
      case "month":
        groupFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        };
        break;
      case "year":
        groupFormat = { year: { $year: "$createdAt" } };
        break;
      default:
        throw new Error("Invalid filter");
    }

    return await Booking.aggregate([
      { $match: { status: "Confirmed" } },
      { $group: { _id: groupFormat, totalRevenue: { $sum: "$totalPrice" } } },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);
  }
}

export default new BookingRepository();
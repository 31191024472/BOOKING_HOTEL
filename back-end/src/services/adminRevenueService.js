import bookingRepository from "../repositories/adminRevenueRepository.js";

class RevenueService {
  async getFormattedRevenue(filter) {
    const rawData = await bookingRepository.getRevenueDataByFilter(filter);

    return rawData.map((entry) => {
      let label = "";
      const { year, month, day } = entry._id;

      if (filter === "day") {
        label = `${day}-${month}-${year}`;
      } else if (filter === "month") {
        label = `${month}-${year}`;
      } else if (filter === "year") {
        label = `${year}`;
      }

      return {
        ...entry,
        label,
      };
    });
  }
}

export default new RevenueService();
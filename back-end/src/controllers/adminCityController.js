import * as cityService from "../services/adminCityService.js";

export const getCities = async (req, res) => {
  try {
    const cities = await cityService.getAllCities();
    res.status(200).json({ cities });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách thành phố", error });
  }
};

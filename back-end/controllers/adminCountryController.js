import * as countryService from "../services/adminCountryService.js";

export const getCountries = async (req, res) => {
  try {
    const countries = await countryService.getCountries();
    res.json({ success: true, countries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCountryById = async (req, res) => {
  try {
    const country = await countryService.getCountry(req.params.id);
    if (!country) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy quốc gia" });
    }
    res.json({ success: true, country });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCountry = async (req, res) => {
  try {
    const { name, code } = req.body;
    const country = await countryService.addCountry(name, code);
    res
      .status(201)
      .json({ success: true, message: "Tạo quốc gia thành công!", country });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCountry = async (req, res) => {
  try {
    const { name, code } = req.body;
    const updatedCountry = await countryService.updateCountry(
      req.params.id,
      name,
      code
    );
    res.json({
      success: true,
      message: "Cập nhật quốc gia thành công",
      country: updatedCountry,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCountry = async (req, res) => {
  try {
    await countryService.removeCountry(req.params.id);
    res.json({ success: true, message: "Xóa quốc gia thành công!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

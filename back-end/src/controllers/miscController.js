import miscService from '../services/miscService.js';

export const getCountries = async (req, res) => {
  try {
    const countries = await miscService.getCountries();

    res.json({
      errors: [],
      data: {
        elements: countries
      }
    });
  } catch (error) {
    console.error("Get countries error:", error);
    res.status(500).json({ errors: [error.message], data: { elements: [] } });
  }
};

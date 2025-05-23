import Country from '../models/Country.js';

const getCountries = () => {
  return Country.find();  // Trả toàn bộ danh sách quốc gia
};

export default { getCountries };
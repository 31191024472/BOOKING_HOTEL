import miscRepository from '../repositories/miscRepository.js';

const getCountries = async () => {
  return await miscRepository.getCountries();
};

export default { getCountries };

import * as cityRepository from "../repositories/adminCityRespository.js";

export const getAllCities = async () => {
  return await cityRepository.findAllCities();
};

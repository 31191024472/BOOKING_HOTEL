import * as countryRepository from "../repositories/adminCountryRespository.js";

export const getCountries = async () => {
  return await countryRepository.getAllCountries();
};

export const getCountry = async (id) => {
  return await countryRepository.getCountryById(id);
};

export const addCountry = async (name, code) => {
  const existingCountry = await countryRepository.getCountryByCode(code);
  if (existingCountry) {
    throw new Error("Mã quốc gia đã tồn tại!");
  }
  return await countryRepository.createCountry({ name, code });
};

export const updateCountry = async (id, name, code) => {
  const country = await countryRepository.getCountryById(id);
  if (!country) {
    throw new Error("Quốc gia không tồn tại");
  }
  return await countryRepository.updateCountry(id, { name, code });
};

export const removeCountry = async (id) => {
  const country = await countryRepository.getCountryById(id);
  if (!country) {
    throw new Error("Quốc gia không tồn tại");
  }
  return await countryRepository.deleteCountry(id);
};

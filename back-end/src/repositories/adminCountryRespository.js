import Country from "../models/Country.js";

export const getAllCountries = async () => {
  return await Country.find();
};

export const getCountryById = async (id) => {
  return await Country.findById(id);
};

export const getCountryByCode = async (code) => {
  return await Country.findOne({ code });
};

export const createCountry = async (countryData) => {
  const newCountry = new Country(countryData);
  return await newCountry.save();
};

export const updateCountry = async (id, updateData) => {
  return await Country.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteCountry = async (id) => {
  return await Country.findByIdAndDelete(id);
};

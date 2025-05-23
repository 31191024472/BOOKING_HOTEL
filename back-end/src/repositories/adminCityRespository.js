import City from "../models/City.js";

export const findAllCities = async () => {
  return await City.find();
};

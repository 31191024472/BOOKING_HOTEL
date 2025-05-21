import * as hotelRepo from "../repositories/adminHotelRespository.js";
import  uploadImageToCloudinary  from "../utils/cloudinaryHelper.js";

export const getAllHotels = async () => await hotelRepo.getAllHotels();

export const getHotelById = async (id) => await hotelRepo.getHotelById(id);

export const createHotel = async (hotelData, files) => {
  // Upload ảnh lên Cloudinary
  const imageUrls =
    files.length > 0
      ? await Promise.all(
          files.map((file) => uploadImageToCloudinary(file.buffer))
        )
      : [];

  hotelData.imageUrls = imageUrls;

  if (typeof hotelData.benefits === "string") {
    try {
      hotelData.benefits = JSON.parse(hotelData.benefits);
    } catch (err) {
      hotelData.benefits = hotelData.benefits.split(",").map((b) => b.trim());
    }
  }

  return await hotelRepo.createHotel(hotelData);
};

export const updateHotel = async (id, updateData, files) => {
  if (files.length > 0) {
    updateData.imageUrls = await Promise.all(
      files.map((file) => uploadImageToCloudinary(file.buffer))
    );
  }
  return await hotelRepo.updateHotel(id, updateData);
};

export const deleteHotel = async (id) => await hotelRepo.deleteHotel(id);

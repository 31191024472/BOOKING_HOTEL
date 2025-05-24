import paymentRepository from "../repositories/paymentRepository.js";

const addPaymentMethod = async (paymentData) => {
    return await paymentRepository.addPaymentMethod(paymentData);
  };
  
  const getUserPaymentMethods = async (userId) => {
    return await paymentRepository.getUserPaymentMethods(userId);
  };
  
  export default { addPaymentMethod, getUserPaymentMethods };
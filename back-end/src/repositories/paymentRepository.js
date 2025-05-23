import Payment from "../models/PaymentMethod.js"

const addPaymentMethod = (data) => Payment.create(data);
const getUserPaymentMethods = (userId) => Payment.find({ userId: userId });

export default { addPaymentMethod, getUserPaymentMethods };
import { fetchApi } from './api';

export const createPaymentOrder = async (bookingId: string) => {
  return fetchApi('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ bookingId })
  });
};

export const verifyPayment = async (paymentData: any /* eslint-disable-line */) => {
  return fetchApi('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(paymentData)
  });
};

export const getPaymentDetails = async (bookingId: string) => {
  return fetchApi(`/payments/${bookingId}`);
};

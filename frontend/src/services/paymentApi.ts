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

export const getPaymentMode = async () => {
  return fetchApi('/payments/mode');
};

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


import api from './api';

/**
 * Payment service — Stripe checkout
 */
export const paymentService = {
  /** Create checkout session and get Stripe URL */
  createCheckout: async (itemId, itemType = 'formula') => {
    const { data } = await api.post('/payments/checkout', { itemId, itemType });
    return data;
  },
};

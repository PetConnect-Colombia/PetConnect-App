import api from './api';

interface CreateCheckoutSessionResponse {
  url: string;
}

export const createStripeCheckoutSession = async (
  amount: number,
  userId?: string,
  userName?: string
): Promise<CreateCheckoutSessionResponse> => {
  const response = await api.post<CreateCheckoutSessionResponse>('/donations/checkout', {
    amount,
    currency: 'usd', // Assuming USD, can be made dynamic if needed
    description: 'Donación a PetConnect',
    metadata: {
      userId: userId || 'guest',
      userName: userName || 'Guest Donor',
    },
  });
  return response.data;
};

interface ConfirmPaymentResponse {
  success: boolean;
  donation: any; // Or IDonation interface
}

export const confirmPayment = async (sessionId: string): Promise<ConfirmPaymentResponse> => {
  const response = await api.post<ConfirmPaymentResponse>('/donations/confirm-payment', { sessionId });
  return response.data;
};

interface DonationListResponse {
  items: any[]; // Or IDonation interface
}

export const getDonations = async (): Promise<DonationListResponse> => {
  const response = await api.get<DonationListResponse>('/donations');
  return response.data;
};

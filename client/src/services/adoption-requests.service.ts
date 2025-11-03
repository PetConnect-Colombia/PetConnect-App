
import api from './api';

/**
 * Fetches all adoption requests from the API (admin only).
 */
export const getAllAdoptionRequests = async () => {
  const res = await api.get('/adoption-requests');
  return res.data;
};

/**
 * Updates the status of an adoption request (admin only).
 */
export const updateAdoptionRequestStatus = async (id: string, status: string) => {
  const res = await api.put(`/adoption-requests/${id}`, { status });
  return res.data;
};

/**
 * Creates a new adoption request.
 */
export const createAdoptionRequest = async (data: { pet: string; formSubmission: string; contactEmail: string; contactPhone: string; }) => {
    const res = await api.post('/adoption-requests', data);
    return res.data;
};

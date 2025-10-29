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
export const createAdoptionRequest = async (data: { pet: string; formSubmission: string; contactEmail: string; contactPhone: string; message: string; }) => {
  const res = await api.post('/adoption-requests', data);
  return res.data;
};

/**
 * Fetches all adoption requests for the currently logged-in user.
 */
export const getMyAdoptionRequests = async () => {
  const res = await api.get('/adoption-requests/my-requests');
  return res.data;
};

/**
 * Fetches a single adoption request by ID (admin only).
 */
export const getAdoptionRequestById = async (id: string) => {
  const res = await api.get(`/adoption-requests/${id}`);
  return res.data;
};
import api from './api';

interface AdopterFormSubmissionData {
  fullName: string;
  email: string;
  phone: string;
  housingType: string;
  hasOtherPets: boolean;
  hasChildren: boolean;
  livesWithAdults: boolean;
  ageRange: string;
  department: string;
  city: string;
  petPreference: string;
  reasonForAdoption: string;
}

/**
 * Submits the adopter form to the API.
 */
export const submitAdopterForm = async (data: AdopterFormSubmissionData) => {
  const res = await api.post('/form-submissions', data);
  return res.data;
};

/**
 * Fetches all adopter form submissions from the API (admin only).
 */
export const getAllFormSubmissions = async () => {
  const res = await api.get('/form-submissions');
  return res.data;
};

/**
 * Fetches a single adopter form submission by its ID from the API (admin only).
 */
export const getFormSubmissionById = async (id: string) => {
  const res = await api.get(`/form-submissions/${id}`);
  return res.data;
};

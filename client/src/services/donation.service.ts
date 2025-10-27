import api from "./api";

// 🟢 Obtener todos los donations
export const getDonations = async () => {
  const res = await api.get("/donations");
  return res.data.items;
};

// 🟢 Obtener un Donation por ID
export const getDonationById = async (id: string) => {
  const res = await api.get(`/donations/${id}`);
  return res.data.item;
};

// 🟢 Crear Donation
export const createDonation = async (data: any, token?: string) => {
  const res = await api.post("/donations", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.item;
};

// 🟢 Actualizar Donation
export const updateDonation = async (id: string, data: any, token?: string) => {
  const res = await api.put(`/donations/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.item;
};

// 🟢 Eliminar Donation
export const deleteDonation = async (id: string, token?: string) => {
  const res = await api.delete(`/donations/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.status === 204;
};

// 🟢 Totales Donation
export const totalsDonation = async (token?: string) => {
  const res = await api.get(`/donations/totals`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.status === 204;
};

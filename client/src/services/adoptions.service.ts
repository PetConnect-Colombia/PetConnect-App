import api from "./api";

export const getAdoptions = async () => {
  const res = await api.get("/adoptions");
  return res.data.items;
};

export const createAdoption = async (data: any) => {
  const res = await api.post("/adoptions", data);
  return res.data.item;
};

export const updateAdoption = async (id: string, data: any, token?: string) => {
  const res = await api.put(`/adoptions/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.item;
};

export const deleteAdoption = async (id: string, token?: string) => {
  const res = await api.delete(`/adoptions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.status === 204;
};

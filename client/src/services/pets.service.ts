import api from "./api";


// api.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;

// ✅ Obtener todas las mascotas
export const getPets = async (status?: string) => { // Added optional status parameter
  let url = "/pets";
  if (status) {
    url += `?status=${status}`; // Manually construct URL with query parameter
  }
  const res = await api.get(url); // Pass URL directly
  return res.data.items;
};

// ✅ Obtener una mascota por ID
export const getPetById = async (id: string) => {
  const res = await api.get(`/pets/${id}`);
  return res.data.item;
};

// ✅ Crear mascota (requiere auth admin)
export const createPet = async (data: any, token?: string) => {
  const res = await api.post("/pets", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.item;
};

// ✅ Actualizar mascota (requiere auth admin)
export const updatePet = async (id: string, data: any, token?: string) => {
  const res = await api.put(`/pets/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.item;
};

// ✅ Eliminar mascota (requiere auth admin)
export const deletePet = async (id: string, token?: string) => {
  const res = await api.delete(`/pets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.status === 204;
};

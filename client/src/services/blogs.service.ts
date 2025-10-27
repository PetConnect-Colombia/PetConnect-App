import api from "./api";

// 🟢 Obtener todos los blogs
export const getBlogs = async () => {
  const res = await api.get("/blogs");
  return res.data.items;
};

// 🟢 Obtener un blog por ID
export const getBlogById = async (id: string) => {
  const res = await api.get(`/blogs/${id}`);
  return res.data.item;
};

// 🟢 Crear blog
export const createBlog = async (data: any, token?: string) => {
  const res = await api.post("/blogs", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.item;
};

// 🟢 Actualizar blog
export const updateBlog = async (id: string, data: any, token?: string) => {
  const res = await api.put(`/blogs/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.item;
};

// 🟢 Eliminar blog
export const deleteBlog = async (id: string, token?: string) => {
  const res = await api.delete(`/blogs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.status === 204;
};

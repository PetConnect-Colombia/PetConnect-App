import { useState, useEffect } from "react";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/services/blogs.service";

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await getBlogs();
      setBlogs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addBlog = async (data: any, token?: string) => {
    const blog = await createBlog(data, token);
    setBlogs([blog, ...blogs]);
  };

  const editBlog = async (id: string, data: any, token?: string) => {
    const blog = await updateBlog(id, data, token);
    setBlogs(blogs.map((b) => (b._id === id ? blog : b)));
  };

  const removeBlog = async (id: string, token?: string) => {
    await deleteBlog(id, token);
    setBlogs(blogs.filter((b) => b._id !== id));
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  return { blogs, loading, error, addBlog, editBlog, removeBlog, reload: loadBlogs };
};

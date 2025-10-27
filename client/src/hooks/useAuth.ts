import { useState } from "react";
import { loginUser, registerUser } from "@/services/auth.service";
import { useAlert } from "@/app/context/AlertContext";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { showAlert } = useAlert();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.token);
      setUser(res.user);
      showAlert("success", "Login exitoso.");
      return res;
    } 
    catch (error) {
      showAlert("error", "Usuario o contraseña incorrectos.");
    }
    finally {
      setLoading(false);
    }
  };
  
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await registerUser({ name, email, password });
      if( res.token){
        showAlert("success", "Registro exitoso. Por favor, inicia sesión.");
      }
      return res;
    }
    catch (error) {
      showAlert("error", "Error en el registro.");
    } 
    finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, login, register, logout, loading };
};

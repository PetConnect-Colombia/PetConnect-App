import { useState, useEffect } from "react";
import { getPets, createPet, updatePet, deletePet } from "@/services/pets.service";

export const usePets = () => {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Cargar lista de mascotas
  const loadPets = async () => {
    setLoading(true);
    try {
      const data = await getPets();
      setPets(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Crear
  const addPet = async (data: any, token?: string) => {
    const pet = await createPet(data, token);
    setPets([pet, ...pets]);
  };

  // 🔹 Actualizar
  const editPet = async (id: string, data: any, token?: string) => {
    const pet = await updatePet(id, data, token);
    setPets(pets.map(p => (p._id === id ? pet : p)));
  };

  // 🔹 Actualizar estado de mascota
  const updatePetStatus = async (id: string, status: string, token?: string) => {
    await updatePet(id, { status }, token);
    loadPets(); // Re-fetch all pets to ensure state is updated
  };

  // 🔹 Eliminar
  const removePet = async (id: string, token?: string) => {
    await deletePet(id, token);
    setPets(pets.filter(p => p._id !== id));
  };

  useEffect(() => {
    loadPets();
  }, []);

  return { pets, loading, error, addPet, editPet, removePet, updatePetStatus, reload: loadPets };
};

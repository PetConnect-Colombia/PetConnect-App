import { useState, useEffect } from "react";
import { getDonations as fetchDonations } from "@/services/donations.service"; // Assuming this exists for fetching
import { createStripeCheckoutSession } from "@/services/donations.service"; // New import
import { useAuth } from "@/app/context/AuthContext";

export const useDonations = () => {
  const { isAuthenticated, user } = useAuth();
  const [donations, setDonations] = useState<any[]>([]); // Assuming donations are fetched
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Cargar lista de donaciones (if needed)
  const loadDonations = async () => {
    setLoading(true);
    try {
      // const data = await fetchDonations(); // Uncomment if you have a backend endpoint for listing donations
      // setDonations(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Iniciar proceso de donación con Stripe Checkout
  const addDonation = async (amount: number) => { // Only takes amount
    setLoading(true);
    setError(null);
    try {
      const response = await createStripeCheckoutSession(amount, user?.id, user?.name);
      if (response.url) {
        window.location.href = response.url; // Redirect to Stripe Checkout
      } else {
        throw new Error("No se recibió URL de Stripe Checkout.");
      }
    } catch (err: any) {
      console.error("Error creating Stripe Checkout session:", err);
      setError(err.message || "Error al iniciar la donación.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // loadDonations(); // Uncomment if you want to load donations on mount
  }, []);

  return { donations, loading, error, addDonation, reload: loadDonations };
};

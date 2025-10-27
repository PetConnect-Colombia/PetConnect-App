import { useState, useEffect } from "react";
import {
  getDonations,
  createDonation,
  updateDonation,
  deleteDonation,
  totalsDonation
} from "@/services/donation.service";

export const useDonations = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDonations = async () => {
    setLoading(true);
    try {
      const data = await getDonations();
      setDonations(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addDonation = async (data: any, token?: string) => {
    const donation = await createDonation(data, token);
    setDonations([donation, ...donations]);
  };

  const editDonation = async (id: string, data: any, token?: string) => {
    const donation = await updateDonation(id, data, token);
    setDonations(donations.map((b) => (b._id === id ? donation : b)));
  };

  const removeDonation = async (id: string, token?: string) => {
    await deleteDonation(id, token);
    setDonations(donations.filter((b) => b._id !== id));
  };

  const totalsDonations = async (token?: string) => {
    return await totalsDonation(token);
  };

  useEffect(() => {
    loadDonations();
  }, []);

  return { donations, loading, error, addDonation, editDonation, removeDonation, totalsDonations, reload: loadDonations };
};

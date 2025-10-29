import { useState, useEffect } from 'react';
import { getDashboardStats } from '@/services/stats.service';
import { useAuth } from '@/app/context/AuthContext';

interface DashboardStats {
  totalPets: number;
  adoptedPets: number;
  availablePets: number;
  inProcessPets: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  petsByKind: { [key: string]: number };
}

export const useDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated || user?.role !== 'admin') {
        setLoading(false);
        return; // Do not fetch if not authenticated or not admin
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("No se pudieron cargar las estadísticas del dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, user]);

  return { stats, loading, error };
};
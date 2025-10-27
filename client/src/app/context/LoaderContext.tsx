'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import Loader from '@/app/components/custom/Loader';

interface LoaderContextProps {
  showLoader: () => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextProps | undefined>(undefined);

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {loading && <Loader />}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader debe usarse dentro de LoaderProvider');
  }
  return context;
}

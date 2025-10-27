'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Alert from '@/app/components/custom/Alert';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertContextProps {
  showAlert: (type: AlertType, message: string) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);

  const showAlert = useCallback((type: AlertType, message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000); // se cierra solo
  }, []);

  const hideAlert = () => setAlert(null);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={hideAlert} />
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert debe usarse dentro de un AlertProvider');
  }
  return context;
}

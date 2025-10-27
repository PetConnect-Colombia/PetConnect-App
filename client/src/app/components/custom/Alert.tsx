'use client';

import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { JSX } from 'react';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose: () => void;
}
export type AlertType = 'success' | 'error' | 'warning' | 'info';

const icons: Record<AlertType, JSX.Element> = {
  success: <CheckCircle className="w-6 h-6 text-[#4BB543]" />,
  error: <AlertCircle className="w-6 h-6 text-[#E63946]" />,
  warning: <AlertTriangle className="w-6 h-6 text-[#FFA23C]" />,
  info: <Info className="w-6 h-6 text-[#3DD9D6]" />,
};

export default function Alert({ type, message, onClose }: AlertProps) {
  const colors: Record<AlertType, string> = {
    success: 'bg-[#e8fbe6] border-[#7ED957] text-[#2D2D2D]',
    error: 'bg-[#ffeaea] border-[#E63946] text-[#2D2D2D]',
    warning: 'bg-[#fff5e6] border-[#FFA23C] text-[#2D2D2D]',
    info: 'bg-[#e0f7fa] border-[#3DD9D6] text-[#2D2D2D]',
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 min-w-[280px] max-w-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border-l-4 animate-alert-in ${colors[type]}`}
      role="alert"
      aria-live="assertive"
    >
      <span>{icons[type]}</span>
      <span className="flex-1 font-medium text-sm">{message}</span>
      <button
        onClick={onClose}
        aria-label="Cerrar alerta"
        className="ml-2 p-1 rounded hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-[#3DD9D6]"
      >
        <X className="w-5 h-5 opacity-80 hover:opacity-100" />
      </button>
      <style jsx global>{`
        @keyframes alert-in {
          from { opacity: 0; transform: translateY(-20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-alert-in {
          animation: alert-in 0.4s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}
import React from 'react';
import { ToastMessage } from '../types';
import { CircleCheck, CircleAlert, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 ${
            t.type === 'error'
              ? 'bg-rose-900/90 text-white border-rose-700'
              : t.type === 'success'
              ? 'bg-[#18392d]/95 text-emerald-100 border-[#2b5947]'
              : 'bg-stone-900/90 text-stone-100 border-stone-700'
          }`}
          role="alert"
        >
          {t.type === 'error' && <CircleAlert className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />}
          {t.type === 'success' && <CircleCheck className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />}
          {t.type === 'info' && <Info className="w-5 h-5 text-sky-300 shrink-0 mt-0.5" />}
          <div className="flex-1 text-xs leading-relaxed font-medium">{t.message}</div>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-stone-400 hover:text-white transition-colors p-0.5 rounded cursor-pointer"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

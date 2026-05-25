'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { Toast, ToastData, ToastVariant } from './toast';

interface ToasterContextValue {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const ToasterContext = createContext<ToasterContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToasterContext);
}

export function Toaster({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = 'info', duration = 4000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant, duration }]);
    if (duration > 0) {
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
    }
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToasterContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToasterContext.Provider>
  );
}

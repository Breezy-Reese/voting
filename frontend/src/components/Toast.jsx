import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((msg, opts = {}) => {
    const id = Math.random().toString(36).slice(2,9);
    setToasts(t => [...t, { id, msg, ...opts }]);
    if (!opts.persistent) setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), opts.timeout || 3000);
  }, []);

  const value = { push };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background: 'white', padding: '10px 14px', borderRadius: 10, boxShadow: '0 8px 30px rgba(2,6,23,0.12)', minWidth: 220 }}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default function Toast() { return null; }

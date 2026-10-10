import { createContext, useContext, useState, useCallback } from "react";
import { CircleCheck as CheckCircle2, Circle as XCircle, Info, X } from "lucide-react";

const ToastContext = createContext();

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success") => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 3500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onClose }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-success-600" />,
    error: <XCircle className="w-5 h-5 text-error-600" />,
    info: <Info className="w-5 h-5 text-navy-500" />,
  };

  const bg = {
    success: "bg-white border-success-100",
    error: "bg-white border-error-100",
    info: "bg-white border-navy-100",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${bg[toast.type]} animate-slide-up pointer-events-auto min-w-[280px] max-w-sm`}
    >
      {icons[toast.type]}
      <p className="text-sm text-navy-700 font-medium flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-navy-300 hover:text-navy-500 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

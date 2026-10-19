/**
 * Minimal toast notification system.
 * Usage: import { useToastStore, ToastContainer } from "./Toast"
 *   - Call useToastStore.getState().addToast("message", "error") from anywhere.
 *   - Render <ToastContainer /> once at the app root.
 */
import { useEffect } from "react";
import { create } from "zustand";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

export type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, variant?: ToastVariant) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, variant = "info") =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: crypto.randomUUID(), message, variant },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

// ---------------------------------------------------------------------------
// Individual Toast item
// ---------------------------------------------------------------------------

const variantStyles: Record<ToastVariant, string> = {
  success: "border-green-200 bg-green-50 text-green-800",
  error:   "border-red-200 bg-red-50 text-red-800",
  info:    "border-blue-200 bg-blue-50 text-blue-800",
};

const variantIcon: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 size={16} className="shrink-0 text-green-600" />,
  error:   <AlertCircle  size={16} className="shrink-0 text-red-600"   />,
  info:    <Info         size={16} className="shrink-0 text-blue-600"  />,
};

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((state) => state.removeToast);

  // Auto-dismiss after 4 s.
  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-panel border px-4 py-3 shadow-panel text-sm ${variantStyles[toast.variant]}`}
    >
      {variantIcon[toast.variant]}
      <p className="flex-1 leading-5">{toast.message}</p>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => removeToast(toast.id)}
        className="ml-1 shrink-0 opacity-60 hover:opacity-100"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toast container — fixed to bottom-right
// ---------------------------------------------------------------------------

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-5 right-5 z-[100] flex w-80 flex-col gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

/**
 * Контекст для управления состоянием тостов
 */
const ToastContext = React.createContext<{
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

/**
 * Тип для тоста
 */
type Toast = {
  id: string;
  title?: string;
  description?: string;
  type?: "default" | "success" | "error" | "warning";
  duration?: number;
}

/**
 * Провайдер тостов
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, ...toast }])

    if (toast.duration !== Infinity) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, toast.duration || 5000)
    }
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

/**
 * Хук для использования тостов
 */
export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

/**
 * Контейнер для тостов
 */
function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

/**
 * Компонент тоста
 */
function Toast({
  id,
  title,
  description,
  type = "default",
  onClose,
}: Toast & { onClose: () => void }) {
  return (
    <div
      className={cn(
        "p-4 rounded-md shadow-md flex gap-3 items-start",
        "animate-in slide-in-from-right fade-in duration-300",
        "bg-background border",
        {
          "border-green-500 border-l-4": type === "success",
          "border-red-500 border-l-4": type === "error",
          "border-yellow-500 border-l-4": type === "warning",
          "border-border": type === "default"
        }
      )}
    >
      <div className="flex-1">
        {title && <h4 className="font-medium text-sm">{title}</h4>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <button
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
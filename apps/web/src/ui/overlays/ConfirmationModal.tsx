import { ReactNode } from "react"; // 👈 1. Import ReactNode
import { Modal } from "./Modal";
import { Button } from "../components/Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode; // 👈 2. Add children to the interface
}

export function ConfirmationModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
  children, // 👈 3. Destructure children here
}: ConfirmationModalProps) {
  const variantStyles = {
    danger: {
      icon: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-200",
      button: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
    },
    warning: {
      icon: "text-yellow-500",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      button: "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500",
    },
    info: {
      icon: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
      button: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <div className="text-center">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${styles.bg} mb-4`}>
          <AlertTriangle size={32} className={styles.icon} />
        </div>
        <p className="text-gray-600 mb-4">{message}</p> {/* Added a small margin bottom */}
        
        {/* 👈 4. Render inputs here if they are passed in */}
        {children && <div className="text-left mt-4 mb-2">{children}</div>} 
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          className={`flex-1 ${styles.button}`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Processing...</span>
            </div>
          ) : (
            confirmText
          )}
        </Button>
      </div>
    </Modal>
  );
}

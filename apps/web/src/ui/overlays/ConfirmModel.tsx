import { Modal } from "./Modal";
import { Button } from "../components/Button";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;  // Add this
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  children,  // Add this
  loading,
  onConfirm,
  onClose
}: ConfirmModalProps) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      {description && <p className="text-gray-600">{description}</p>}
      {children}  {/* Render children */}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
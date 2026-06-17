import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg rounded-xl bg-white shadow-xl animate-fade-in max-h-[90vh] flex flex-col">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl z-10">
            <DialogTitle className="text-xl font-semibold text-[var(--color-brand-text)]">
              {title}
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            {children}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
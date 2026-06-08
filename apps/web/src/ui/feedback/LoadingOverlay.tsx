import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from './Spinner';

interface LoadingOverlayProps {
  isLoading?: boolean;
  message?: string;
}

export function LoadingOverlay({ isLoading = true, message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Loading Card */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-2xl p-8 min-w-[280px] text-center"
          >
            {/* Animated Spinner */}
            <div className="mb-4">
              <Spinner size="lg" />
            </div>
            
            {/* Loading Message */}
            <p className="text-gray-700 font-medium">{message}</p>
            
            {/* Animated Dots */}
            <div className="flex justify-center gap-1 mt-2">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)]"
              />
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)]"
              />
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
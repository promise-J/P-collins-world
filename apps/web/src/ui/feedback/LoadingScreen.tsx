
import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="relative">
          <div className="w-28 h-28 bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-5xl font-bold text-white">P</span>
          </div>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-2 bg-[var(--color-brand-primary)]/20 rounded-2xl -z-10"
          />
        </div>
      </motion.div>

      {/* Spinner */}
      <div className="relative mb-6">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-12 h-12 border-4 border-t-[var(--color-brand-primary)] border-r-transparent border-b-transparent border-l-transparent rounded-full"
        />
      </div>

      {/* Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 font-medium"
      >
        Loading...
      </motion.p>

      {/* Decorative dots */}
      <div className="flex gap-2 mt-4">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)]/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)]/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)]/10" />
      </div>
    </div>
  );
}
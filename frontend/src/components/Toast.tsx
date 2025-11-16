import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose }) => {
  // Auto-dismiss after 3.5s
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Toast palette
  const palette = {
    success: {
      bg: "bg-green-50/95",
      border: "border-green-400",
      text: "text-green-800",
      icon: "✅",
    },
    error: {
      bg: "bg-red-50/95",
      border: "border-red-400",
      text: "text-red-800",
      icon: "❌",
    },
    info: {
      bg: "bg-blue-50/95",
      border: "border-blue-400",
      text: "text-blue-800",
      icon: "ℹ️",
    },
  } as const;

  const style = palette[type];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none"
        >
          <motion.div
            className={`pointer-events-auto flex items-center gap-3 rounded-xl border ${style.border} ${style.bg} shadow-xl p-4 min-w-[300px] max-w-xs`}
          >
            <div className="text-2xl">{style.icon}</div>
            <div className="flex-1">
              <p className={`text-sm font-semibold ${style.text}`}>{message}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

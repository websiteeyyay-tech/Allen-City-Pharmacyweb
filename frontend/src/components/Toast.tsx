// src/components/Toast.tsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const palette = {
    success: { bg: "bg-green-50/95", border: "border-green-400", text: "text-green-700", icon: "✅" },
    error: { bg: "bg-red-50/95", border: "border-red-400", text: "text-red-700", icon: "❌" },
    info: { bg: "bg-blue-50/95", border: "border-blue-400", text: "text-blue-700", icon: "ℹ️" },
  } as const;

  const style = palette[type];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-start justify-center pointer-events-none p-4"
        >
          <div className="pointer-events-auto w-full max-w-sm">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className={`rounded-lg border ${style.border} ${style.bg} shadow-lg p-4`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{style.icon}</div>
                <div className="flex-1">
                  <p className={`font-semibold ${style.text}`}>{message}</p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close toast"
                  className="text-gray-500 hover:text-gray-700 ml-2"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

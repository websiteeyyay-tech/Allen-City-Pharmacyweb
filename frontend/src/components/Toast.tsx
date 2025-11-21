import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = 3500;
    const step = 100 / (duration / 50);

    const interval = setInterval(() => {
      setProgress((p) => Math.max(0, p - step));
    }, 50);

    const timer = setTimeout(onClose, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onClose]);

  const palette = {
    success: {
      bg: "bg-green-500",
      iconBg: "bg-green-600",
      title: "Success!",
      icon: "✓",
    },
    error: {
      bg: "bg-red-500",
      iconBg: "bg-red-600",
      title: "Error!",
      icon: "✕",
    },
    info: {
      bg: "bg-blue-500",
      iconBg: "bg-blue-600",
      title: "Info!",
      icon: "i",
    },
    warning: {
      bg: "bg-yellow-500",
      iconBg: "bg-yellow-600",
      title: "Warning!",
      icon: "!",
    },
  } as const;

  const style = palette[type];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -25 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="fixed top-6 left-6 z-50 pointer-events-none"
        >
          <motion.div
            className={`
              pointer-events-auto rounded-lg shadow-lg overflow-hidden text-white
              w-[430px] max-w-[90vw] 
              sm:w-[430px] 
              transition-all
            `}
          >
            <div className={`p-5 flex gap-4 items-start ${style.bg}`}>
              {/* Icon */}
              <div
                className={`
                  flex items-center justify-center rounded-full 
                  font-bold 
                  ${style.iconBg}
                  w-10 h-10 text-xl
                  sm:w-12 sm:h-12 sm:text-2xl
                `}
              >
                {style.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg sm:text-xl">{style.title}</p>
                <p className="text-white/95 mt-1 text-sm sm:text-base break-words">
                  {message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-white ml-4 hover:opacity-80 text-xl sm:text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-black/10">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.05 }}
                className={`h-full ${style.iconBg}`}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

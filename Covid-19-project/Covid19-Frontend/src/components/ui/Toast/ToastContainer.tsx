import React from "react";
import ToastItem from "./ToastItem";
import type { ToastMessage } from "./types";

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <>
      <div className="fixed top-8 right-8 z-99999 flex flex-col gap-5 pointer-events-none items-end">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
      <style>{`
        @keyframes slideInToastLeft {
          0% { 
            opacity: 0; 
            transform: translateX(100px) scale(0.9);
            filter: blur(10px);
          }
          70% {
            transform: translateX(-10px) scale(1.05);
          }
          100% { 
            opacity: 1; 
            transform: translateX(0) scale(1);
            filter: blur(0);
          }
        }
      `}</style>
    </>
  );
};

export default ToastContainer;

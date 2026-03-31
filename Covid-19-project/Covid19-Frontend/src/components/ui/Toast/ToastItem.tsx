import React from "react";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import type { ToastMessage } from "./types";

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  return (
    <div
      className={`
        pointer-events-auto relative overflow-hidden transform transition-all duration-500 ease-out flex items-center justify-between min-w-[320px] max-w-[420px] px-6 py-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 bg-[#0f172a]/90 backdrop-blur-2xl
        text-white font-semibold text-base sm:text-lg tracking-wide animate-[slideInToastLeft_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]
      `}
    >
      {/* Dynamic Color Accent Gradient Indicator */}
      {toast.type === "success" && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-[#10b981] via-[#34d399] to-[#059669] shadow-[0_0_20px_rgba(16,185,129,0.6)]" />
      )}
      {toast.type === "error" && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-[#f43f5e] via-[#fb7185] to-[#e11d48] shadow-[0_0_20px_rgba(244,63,94,0.6)]" />
      )}
      {toast.type === "warning" && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-[#f59e0b] via-[#fbbf24] to-[#d97706] shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
      )}
      {toast.type === "info" && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-[#6366f1] via-[#818cf8] to-[#4f46e5] shadow-[0_0_20px_rgba(99,102,241,0.6)]" />
      )}

      <div className="flex items-center gap-4 pl-2">
        {toast.type === "success" && <CheckCircle2 className="text-[#10b981] shrink-0" size={26} />}
        {toast.type === "error" && <AlertCircle className="text-[#f43f5e] shrink-0" size={26} />}
        {toast.type === "warning" && <AlertTriangle className="text-[#f59e0b] shrink-0" size={26} />}
        {toast.type === "info" && <Info className="text-[#6366f1] shrink-0" size={26} />}
        <span className="leading-snug text-gray-100">{toast.message}</span>
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        className="ml-5 shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/5 text-gray-400 hover:text-white hover:scale-110 active:scale-95"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ToastItem;

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export interface ToastContextProps {
  showToast: (message: string, type?: ToastType) => void;
}

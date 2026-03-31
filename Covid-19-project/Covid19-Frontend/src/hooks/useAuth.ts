import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { useMutation } from "@tanstack/react-query";
import type { ILoginInput, IRegisterInput } from "../types/auth.types";
import { loginApi, logoutApi, registerApi } from "../api/auth.api";
import { useToast } from "../components/ui/Toast";

// ─── useAuth ─────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const { user, isLoggedIn, clearAuth, setAuth } = useAuthStore();
  return { user, isLoggedIn, clearAuth, setAuth };
};

// ─── useLogin ─────────────────────────────────────────────────────────────────
export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: ILoginInput) => loginApi(data),
    onSuccess: (res) => {
      setAuth(res.data.user);
      showToast("Successfully logged in! Welcome back.", "success");
      navigate("/prediction");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Login failed. Please check your credentials.";
      showToast(message, "error");
    }
  });
};

// ─── useLogout ────────────────────────────────────────────────────────────────
export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      clearAuth();
      showToast("Logged out successfully. See you again soon!", "success");
      navigate("/");
    },
    onError: () => {
      // Even if the server call fails, clear local auth state
      clearAuth();
      showToast("Logged out from session. Please login again.", "info");
      navigate("/");
    },
  });
};

// ─── useRegister ──────────────────────────────────────────────────────────────
export const useRegister = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: IRegisterInput) => registerApi(data),
    onSuccess: () => {
      showToast("Registration successful! Please login to continue.", "success");
      navigate("/login");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Registration failed. Try again.";
      showToast(message, "error");
    }
  });
};

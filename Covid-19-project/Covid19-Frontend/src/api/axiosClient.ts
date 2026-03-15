import axios from "axios";
import { useAuthStore } from "../store/auth.store";


const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // backend base URL
  withCredentials: true, // cookie auto-send
  headers: { "Content-Type": "application/json" },
  timeout: 15000, // 15 sec
});

// Request interceptor (optional, if you need auth header)
// Since backend uses HttpOnly cookie, Authorization header is optional
axiosClient.interceptors.request.use(
  (config) => {
    const { isLoggedIn } = useAuthStore.getState();
    // could add extra headers if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 unauthorized → try refresh token once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // call refresh endpoint
        await axiosClient.post("/auth/refresh");
        // retry original request
        return axiosClient(originalRequest);
      } catch (_err) {
        // refresh failed → logout
        useAuthStore.getState().clearAuth();
        return Promise.reject(_err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
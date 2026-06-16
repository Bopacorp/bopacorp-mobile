import axios from "axios";
import { getStorageItem, setStorageItem, removeStorageItem } from "./storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

let accessTokenInMemory: string | null = null;
let onLogoutCallback: (() => void) | null = null;

export const getAccessToken = () => accessTokenInMemory;
export const setAccessToken = (token: string | null) => {
  accessTokenInMemory = token;
};

export const setOnLogout = (callback: () => void) => {
  onLogoutCallback = callback;
};

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach memory-stored Access Token
apiClient.interceptors.request.use(
  (config) => {
    if (accessTokenInMemory) {
      config.headers.Authorization = `Bearer ${accessTokenInMemory}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Queue system for concurrent requests during refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Response interceptor: Unwrap standard Bopacorp envelope & handle 401s
apiClient.interceptors.response.use(
  (response) => {
    // Backend responses format is { success: boolean, data: ... }
    if (response.data && response.data.success !== undefined) {
      if (response.data.success) {
        return response.data.data;
      } else {
        // Handle successful HTTP request but backend returned business logic error
        const backendError = response.data.error || {
          code: "UNKNOWN_ERROR",
          message: "Ocurrió un error inesperado.",
        };
        return Promise.reject(backendError);
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already retried this request
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const refreshToken = await getStorageItem("refreshToken");
          if (!refreshToken) {
            throw new Error("No refresh token stored.");
          }

          // Use a clean axios instance to avoid loops
          const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
            refreshToken,
          });

          if (response.data && response.data.success) {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

            setAccessToken(newAccessToken);
            await setStorageItem("refreshToken", newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            resolve(apiClient(originalRequest));
          } else {
            throw new Error("Refresh response did not indicate success.");
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          if (onLogoutCallback) {
            onLogoutCallback();
          }
          reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      });
    }

    // Standardize HTTP errors to match Bopacorp error shape
    if (error.response && error.response.data && error.response.data.error) {
      return Promise.reject(error.response.data.error);
    }

    const networkError = {
      code: "NETWORK_ERROR",
      message: error.message || "No se pudo conectar con el servidor.",
    };
    return Promise.reject(networkError);
  }
);

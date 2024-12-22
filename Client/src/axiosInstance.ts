import axios from "axios";
import { RefreshToken } from "./queries/authQueries";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const data = await RefreshToken();
        const newAccessToken = data;
        localStorage.setItem("accessToken", newAccessToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        return Promise.resolve();
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

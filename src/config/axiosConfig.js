import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ecommerce-1zev.onrender.com/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to automatically add the Authorization header if a token is present
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

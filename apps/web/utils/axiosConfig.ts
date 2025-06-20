import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        if (key && value) {
          acc[key] = decodeURIComponent(value);
        }
        return acc;
      }, {} as Record<string, string>);

      const host = window.location.host;
      const accessToken = cookies[`${host}:at`];

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log("🔑 Added Authorization header to request");
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("🚨 401 Unauthorized - redirecting to login");

      if (typeof window !== "undefined") {
        const host = window.location.host;
        document.cookie = `${host}:at=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${host}:rt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${host}:ut=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

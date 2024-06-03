import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/", // Replace with your Django backend URL
});

// Attach the token to every request
apiClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("firebaseToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

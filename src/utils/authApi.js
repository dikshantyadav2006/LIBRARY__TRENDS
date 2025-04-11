import axios from "axios";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Backend URL
  withCredentials: true, // Send cookies with every request
});

// ✅ Authentication authApis
export const login = (credentials) => authApi.post("/auth/login", credentials);
export const signup = (userData) => authApi.post("/auth/signup", userData);
export const getUserData = () => authApi.get("/auth/userdata");

export default authApi;

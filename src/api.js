import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // Backend URL
  withCredentials: true, // Send cookies with every request
});

// ✅ Authentication APIs
export const login = (credentials) => API.post("/auth/login", credentials);
export const signup = (userData) => API.post("/auth/signup", userData);
export const logout = () => API.post("/auth/logout");
export const getUserData = () => API.get("/auth/userdata");

export default API;

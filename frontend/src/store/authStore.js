import { create } from "zustand";
import axios from "axios";
import { useTaskStore } from "./taskStore";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/v1/auth" : (import.meta.env.VITE_API_URL || "") + "/api/v1/auth";

const getToken = () => localStorage.getItem("token");

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/register`, { email, password, name });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    localStorage.removeItem("token");
    useTaskStore.getState().clearTasks();
    set({ user: null, isAuthenticated: false, error: null, isLoading: false });
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    const token = getToken();
    if (!token) {
      set({ isCheckingAuth: false, isAuthenticated: false });
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/me`);
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
      localStorage.removeItem("token");
      useTaskStore.getState().clearTasks();
      set({ user: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },
}));
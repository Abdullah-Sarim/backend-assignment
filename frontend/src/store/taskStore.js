import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/v1/tasks" : (import.meta.env.VITE_API_URL || "") + "/api/v1/tasks";

const getToken = () => localStorage.getItem("token");

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  currentTask: null,

  fetchTasks: async () => {
    const token = getToken();
    if (!token) {
      set({ tasks: [], isLoading: false });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ tasks: response.data.tasks, isLoading: false });
    } catch (error) {
      set({ tasks: [], error: error.response?.data?.message || "Error fetching tasks", isLoading: false });
    }
  },

  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(API_URL, taskData);
      set({ tasks: [response.data.task, ...get().tasks], isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error creating task", isLoading: false });
      throw error;
    }
  },

  updateTask: async (id, taskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/${id}`, taskData);
      const tasks = get().tasks.map(task => 
        task._id === id ? response.data.task : task
      );
      set({ tasks, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error updating task", isLoading: false });
      throw error;
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      const tasks = get().tasks.filter(task => task._id !== id);
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error deleting task", isLoading: false });
      throw error;
    }
  },

  getTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      set({ currentTask: response.data.task, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching task", isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  
  clearTasks: () => set({ tasks: [], currentTask: null, error: null }),
}));
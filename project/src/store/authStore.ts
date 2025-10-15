import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '../types';
import axiosInstance from '../api/axiosInstance';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string, role: string) => {
        try {
          const response = await axiosInstance.post('/auth/login', {
            email,
            password,
            role
          });

          const { token, user } = response.data;
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));

          set({ user, isAuthenticated: true });
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Login failed');
        }
      },

      logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
      },

      register: async (userData: Partial<User> & { password?: string }) => {
        try {
          const response = await axiosInstance.post('/auth/signup', {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            phone: userData.phone,
            role: 'student'
          });

          const { token, user } = response.data;
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));

          set({ user, isAuthenticated: true });
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Registration failed');
        }
      },

      initializeAuth: () => {
        const token = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({ user, isAuthenticated: true });
          } catch (error) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          }
        }
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);
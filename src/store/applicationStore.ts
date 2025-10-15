import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Application } from '../types';

interface ApplicationState {
  applications: Application[];
  addApplication: (application: Omit<Application, 'id'>) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  getApplicationsByUser: (userId: string) => Application[];
  getApplicationsByJob: (jobId: string) => Application[];
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      applications: [],

      addApplication: (applicationData) => {
        const newApplication: Application = {
          ...applicationData,
          id: Date.now().toString(),
        };
        
        set(state => ({
          applications: [...state.applications, newApplication]
        }));
      },

      updateApplication: (id, updates) => {
        set(state => ({
          applications: state.applications.map(app =>
            app.id === id ? { ...app, ...updates } : app
          )
        }));
      },

      getApplicationsByUser: (userId) => {
        return get().applications.filter(app => app.userId === userId);
      },

      getApplicationsByJob: (jobId) => {
        return get().applications.filter(app => app.jobId === jobId);
      }
    }),
    {
      name: 'applications-storage'
    }
  )
);
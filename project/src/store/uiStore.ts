import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIState } from '../types';

interface CandidatesUIState {
  selectedApplicants: number[];
  setSelectedApplicants: (ids: number[]) => void;
  toggleApplicantSelection: (id: number) => void;
  clearSelection: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      sidebarOpen: true,

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });

        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open })
    }),
    {
      name: 'ui-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      }
    }
  )
);

export const useCandidatesUIStore = create<CandidatesUIState>((set, get) => ({
  selectedApplicants: [],

  setSelectedApplicants: (ids: number[]) => set({ selectedApplicants: ids }),

  toggleApplicantSelection: (id: number) => {
    const { selectedApplicants } = get();
    if (selectedApplicants.includes(id)) {
      set({ selectedApplicants: selectedApplicants.filter(i => i !== id) });
    } else {
      set({ selectedApplicants: [...selectedApplicants, id] });
    }
  },

  clearSelection: () => set({ selectedApplicants: [] })
}));
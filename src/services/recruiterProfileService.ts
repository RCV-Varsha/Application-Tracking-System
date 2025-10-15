import { mockRecruiterProfile, mockRecruiterSettings, RecruiterProfile, RecruiterSettings } from '../mock/recruiterProfile';

let cachedProfile = { ...mockRecruiterProfile };
let cachedSettings = { ...mockRecruiterSettings };

export const getRecruiterProfile = async (): Promise<RecruiterProfile> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { ...cachedProfile };
};

export const updateRecruiterProfile = async (updates: Partial<RecruiterProfile>): Promise<RecruiterProfile> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  cachedProfile = { ...cachedProfile, ...updates };
  return { ...cachedProfile };
};

export const getRecruiterSettings = async (): Promise<RecruiterSettings> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    cachedSettings.appearance.theme = savedTheme as "light" | "dark" | "system";
  }
  return { ...cachedSettings };
};

export const updateRecruiterSettings = async (updates: Partial<RecruiterSettings>): Promise<RecruiterSettings> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  cachedSettings = {
    ...cachedSettings,
    ...updates,
    notifications: { ...cachedSettings.notifications, ...updates.notifications },
    appearance: { ...cachedSettings.appearance, ...updates.appearance }
  };

  if (updates.appearance?.theme) {
    localStorage.setItem('theme', updates.appearance.theme);
    applyTheme(updates.appearance.theme);
  }

  return { ...cachedSettings };
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  if (currentPassword !== 'password') {
    return { success: false, message: 'Current password is incorrect' };
  }

  if (newPassword.length < 8) {
    return { success: false, message: 'New password must be at least 8 characters' };
  }

  return { success: true, message: 'Password changed successfully' };
};

const applyTheme = (theme: "light" | "dark" | "system") => {
  const root = document.documentElement;

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
};

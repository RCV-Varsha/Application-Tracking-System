export const mockAdminSettings = {
  account: {
    fullName: "Admin User",
    email: "admin@example.com",
    role: "System Administrator",
    profileVisibility: true,
  },
  preferences: {
    theme: "light",
    language: "English",
    timezone: "Asia/Kolkata",
    emailNotifications: true,
    pushNotifications: false,
  },
  security: {
    twoFactorAuth: true,
    lastPasswordChange: "2025-09-20",
    loginAlerts: true,
    activeSessions: [
      {
        device: "Windows 11 - Chrome",
        location: "Hyderabad, India",
        ip: "192.168.2.105",
        activeSince: "2025-10-10 11:30 AM",
      },
      {
        device: "iPhone 14 - Safari",
        location: "Delhi, India",
        ip: "192.168.4.90",
        activeSince: "2025-10-12 08:45 PM",
      },
    ],
  },
};

export const getAdminSettings = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockAdminSettings;
};

export const updateAdminSettings = async (settings: typeof mockAdminSettings) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  Object.assign(mockAdminSettings, settings);
  return { success: true };
};

export const terminateSession = async (ip: string) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const index = mockAdminSettings.security.activeSessions.findIndex(
    (session) => session.ip === ip
  );
  if (index !== -1) {
    mockAdminSettings.security.activeSessions.splice(index, 1);
  }
  return { success: true };
};

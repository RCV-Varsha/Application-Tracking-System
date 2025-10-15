export const mockAdminProfile = {
  id: 1,
  name: "Kavya Guntaka",
  role: "Admin / System Manager",
  email: "admin@example.com",
  phone: "+91 9876543210",
  department: "Talent Operations",
  location: "Hyderabad, India",
  bio: "Experienced ATS administrator passionate about optimizing recruitment workflows and team productivity.",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  joinedOn: "2023-02-15",
  lastActive: "2025-10-13T11:45:00Z",
  socialLinks: {
    linkedin: "https://linkedin.com/in/adminuser",
    github: "https://github.com/adminuser",
    twitter: "https://twitter.com/adminuser",
  },
};

export const getAdminProfile = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockAdminProfile;
};

export const updateAdminProfile = async (profile: Partial<typeof mockAdminProfile>) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  Object.assign(mockAdminProfile, profile);
  return { success: true, data: mockAdminProfile };
};

export const uploadAvatar = async (file: File) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const fakeUrl = URL.createObjectURL(file);
  mockAdminProfile.avatar = fakeUrl;
  return { success: true, url: fakeUrl };
};

export const mockRecruiterProfile = {
  id: 1,
  name: "Sarah Chen",
  email: "recruiter@example.com",
  phone: "+91 98765 43210",
  role: "Senior Recruiter",
  company: {
    name: "AceTech Solutions",
    website: "https://acetech.io"
  },
  bio: "Head of Talent Acquisition at AceTech. Passionate about connecting exceptional tech talent with innovative opportunities. 5+ years of experience in technical recruiting.",
  location: "Hyderabad, India",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
};

export const mockRecruiterSettings = {
  notifications: {
    email: true,
    inApp: true,
    jobApplications: true,
    candidateUpdates: true,
    weeklyDigest: false
  },
  appearance: {
    theme: "system" as "light" | "dark" | "system"
  },
};

export interface RecruiterProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  company: {
    name: string;
    website: string;
  };
  bio: string;
  location: string;
  avatarUrl: string;
}

export interface RecruiterSettings {
  notifications: {
    email: boolean;
    inApp: boolean;
    jobApplications: boolean;
    candidateUpdates: boolean;
    weeklyDigest: boolean;
  };
  appearance: {
    theme: "light" | "dark" | "system";
  };
}

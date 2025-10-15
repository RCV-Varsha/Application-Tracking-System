export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'recruiter' | 'admin';
  avatar: string;
  createdAt: string;
  lastActive: string;
  isVerified?: boolean;
  location?: string;
  skills?: string[];
  phone?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  skills: string[];
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  postedAt: string;
  applicantCount: number;
  status: 'active' | 'closed' | 'draft';
  recruiterId: string;
}

export interface Resume {
  id: string;
  userId: string;
  filename: string;
  score: number;
  sections: {
    contact: boolean;
    summary: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
  };
  keywords: string[];
  uploadedAt: string;
  lastModified: string;
  fileUrl?: string;
  analysis: {
    grammarScore: number;
    atsOptimization: number;
    completeness: number;
    suggestions: string[];
  };
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: 'applied' | 'reviewing' | 'shortlisted' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';
  submittedAt: string;
  recruiterNotes?: string;
  timeline: {
    status: string;
    date: string;
    note?: string;
  }[];
  resumeId: string;
  resumeFilename?: string;
  resumeScore?: number;
  matchPercentage?: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'application_update' | 'job_match' | 'resume_feedback' | 'interview_scheduled';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User> & { password?: string }) => Promise<void>;
  initializeAuth: () => void;
}

export interface UIState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}
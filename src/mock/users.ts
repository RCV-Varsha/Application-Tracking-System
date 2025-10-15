export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Student' | 'Recruiter' | 'Admin';
  status: 'Active' | 'Inactive';
  joined: string;
  avatar?: string;
  lastActive?: string;
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav@xtremecoding.com",
    role: "Recruiter",
    status: "Active",
    joined: "2025-06-15",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    lastActive: "2h ago"
  },
  {
    id: 2,
    name: "Kavya Reddy",
    email: "kavya@studenthub.edu",
    role: "Student",
    status: "Inactive",
    joined: "2025-04-22",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150",
    lastActive: "3 days ago"
  },
  {
    id: 3,
    name: "Ananya Patel",
    email: "ananya@atsadmin.org",
    role: "Admin",
    status: "Active",
    joined: "2025-02-11",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    lastActive: "1h ago"
  },
  {
    id: 4,
    name: "Rohit Mehta",
    email: "rohit@xtremecoding.com",
    role: "Recruiter",
    status: "Active",
    joined: "2025-09-03",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    lastActive: "5m ago"
  },
  {
    id: 5,
    name: "Priya Singh",
    email: "priya.singh@college.edu",
    role: "Student",
    status: "Active",
    joined: "2025-08-18",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    lastActive: "30m ago"
  },
  {
    id: 6,
    name: "Arjun Kumar",
    email: "arjun@techhire.com",
    role: "Recruiter",
    status: "Active",
    joined: "2025-07-22",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    lastActive: "15m ago"
  },
  {
    id: 7,
    name: "Neha Gupta",
    email: "neha@university.edu",
    role: "Student",
    status: "Active",
    joined: "2025-09-01",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150",
    lastActive: "2h ago"
  },
  {
    id: 8,
    name: "Vikram Desai",
    email: "vikram@startupjobs.in",
    role: "Recruiter",
    status: "Inactive",
    joined: "2025-03-12",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    lastActive: "1 week ago"
  },
  {
    id: 9,
    name: "Sneha Joshi",
    email: "sneha@campus.edu",
    role: "Student",
    status: "Active",
    joined: "2025-08-05",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150",
    lastActive: "4h ago"
  },
  {
    id: 10,
    name: "Rajesh Iyer",
    email: "rajesh@atsadmin.org",
    role: "Admin",
    status: "Active",
    joined: "2025-01-20",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    lastActive: "10m ago"
  },
  {
    id: 11,
    name: "Aditi Nair",
    email: "aditi@student.edu",
    role: "Student",
    status: "Active",
    joined: "2025-09-10",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    lastActive: "1h ago"
  },
  {
    id: 12,
    name: "Karan Malhotra",
    email: "karan@hrhub.com",
    role: "Recruiter",
    status: "Active",
    joined: "2025-05-28",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
    lastActive: "45m ago"
  }
];

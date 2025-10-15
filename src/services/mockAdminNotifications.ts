export interface AdminNotification {
  id: number;
  type: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  actionUrl?: string;
}

export const adminNotifications: AdminNotification[] = [
  {
    id: 1,
    type: "Recruiter Approval",
    message: "New recruiter request pending approval: Rahul Dev (TechWave)",
    time: "2m ago",
    read: false,
    icon: "user-plus",
    actionUrl: "/admin/user-management",
  },
  {
    id: 2,
    type: "Job Posted",
    message: "Recruiter Anita added a new job post: Frontend Engineer",
    time: "15m ago",
    read: true,
    icon: "briefcase",
    actionUrl: "/admin/job-management",
  },
  {
    id: 3,
    type: "Security Alert",
    message: "Multiple failed login attempts detected from IP 192.168.0.12",
    time: "1h ago",
    read: false,
    icon: "shield-alert",
    actionUrl: "/admin/security",
  },
  {
    id: 4,
    type: "System Update",
    message: "System maintenance scheduled for 14th Oct, 11:30 PM IST.",
    time: "5h ago",
    read: true,
    icon: "info",
  },
  {
    id: 5,
    type: "Job Flagged",
    message: "Job post flagged for review: Data Scientist at ByteNow",
    time: "2h ago",
    read: false,
    icon: "flag",
    actionUrl: "/admin/job-management",
  },
  {
    id: 6,
    type: "User Report",
    message: "User reported inappropriate behavior from recruiter",
    time: "3h ago",
    read: false,
    icon: "alert-triangle",
    actionUrl: "/admin/user-management",
  },
  {
    id: 7,
    type: "System Alert",
    message: "Database backup completed successfully",
    time: "6h ago",
    read: true,
    icon: "check-circle",
  },
  {
    id: 8,
    type: "New User",
    message: "50+ new user registrations today",
    time: "8h ago",
    read: true,
    icon: "users",
    actionUrl: "/admin/analytics",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAdminNotifications = async (): Promise<AdminNotification[]> => {
  await delay(400);
  return adminNotifications;
};

export const markNotificationAsRead = async (id: number): Promise<void> => {
  await delay(200);
  const notification = adminNotifications.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await delay(300);
  adminNotifications.forEach((n) => {
    n.read = true;
  });
};

export const deleteNotification = async (id: number): Promise<void> => {
  await delay(200);
  const index = adminNotifications.findIndex((n) => n.id === id);
  if (index !== -1) {
    adminNotifications.splice(index, 1);
  }
};

export const getUnreadCount = (): number => {
  return adminNotifications.filter((n) => !n.read).length;
};

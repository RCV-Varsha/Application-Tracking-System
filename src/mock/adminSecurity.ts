export const adminSecurity = {
  loginActivity: [
    { id: 1, user: "recruiter@codex.com", role: "Recruiter", ip: "192.168.1.4", location: "Hyderabad, IN", status: "Success", time: "2025-10-11 09:14 AM" },
    { id: 2, user: "admin@ats.com", role: "Admin", ip: "192.168.1.7", location: "Chennai, IN", status: "Success", time: "2025-10-11 08:52 AM" },
    { id: 3, user: "student21@campus.com", role: "User", ip: "192.168.1.9", location: "Mumbai, IN", status: "Failed", time: "2025-10-10 11:17 PM" },
    { id: 4, user: "student10@campus.com", role: "User", ip: "192.168.1.11", location: "Delhi, IN", status: "Blocked", time: "2025-10-10 08:43 PM" },
    { id: 5, user: "recruiter@techwave.com", role: "Recruiter", ip: "192.168.1.15", location: "Bangalore, IN", status: "Success", time: "2025-10-10 07:32 PM" },
    { id: 6, user: "student5@campus.com", role: "User", ip: "192.168.1.23", location: "Pune, IN", status: "Failed", time: "2025-10-10 06:18 PM" },
  ],
  activeSessions: [
    { id: 1, user: "admin@ats.com", device: "MacBook Air", browser: "Chrome", ip: "192.168.1.7", lastActive: "2m ago" },
    { id: 2, user: "recruiter@codex.com", device: "Windows PC", browser: "Edge", ip: "192.168.1.4", lastActive: "10m ago" },
    { id: 3, user: "recruiter@techwave.com", device: "iPhone 15", browser: "Safari", ip: "192.168.1.15", lastActive: "25m ago" },
    { id: 4, user: "student8@campus.com", device: "Android Phone", browser: "Chrome", ip: "192.168.1.31", lastActive: "1h ago" },
  ],
  rolesAndPermissions: [
    { role: "Admin", permissions: ["Create Jobs", "Delete Jobs", "Manage Users", "View Reports", "Update Security"] },
    { role: "Recruiter", permissions: ["Create Jobs", "View Applicants", "Edit Profile"] },
    { role: "User", permissions: ["Apply Jobs", "View Job List", "Update Profile"] },
  ],
  suspiciousIPs: [
    { ip: "202.131.104.11", reason: "Multiple failed logins", status: "Blocked", attempts: 12 },
    { ip: "103.22.18.54", reason: "Unusual region", status: "Flagged", attempts: 5 },
    { ip: "185.220.101.3", reason: "Known malicious actor", status: "Blocked", attempts: 8 },
  ],
  passwordPolicy: {
    minLength: 8,
    requiresUppercase: true,
    requiresNumber: true,
    requiresSymbol: true,
    lastUpdated: "2025-09-15",
  },
  twoFA: {
    enabled: true,
    method: "Email OTP",
    enforced: false,
  },
  summary: {
    totalLogins: 1847,
    failedAttempts: 127,
    activeSessions: 4,
    blockedIPs: 2,
  },
};

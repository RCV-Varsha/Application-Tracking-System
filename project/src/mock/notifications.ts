export interface RecruiterNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'application' | 'status' | 'reminder' | 'system';
  read: boolean;
  actionUrl?: string;
  applicantName?: string;
  jobTitle?: string;
}

export const mockRecruiterNotifications: RecruiterNotification[] = [
  {
    id: 1,
    title: 'New Application Received',
    message: 'Arjun Patel applied for Frontend Developer position.',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: 'application',
    read: false,
    actionUrl: '/recruiter/jobs/1/candidates',
    applicantName: 'Arjun Patel',
    jobTitle: 'Frontend Developer'
  },
  {
    id: 2,
    title: 'Application Status Changed',
    message: 'Priya Singh has been shortlisted for Backend Engineer role.',
    time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    type: 'status',
    read: false,
    actionUrl: '/recruiter/jobs/2/candidates',
    applicantName: 'Priya Singh',
    jobTitle: 'Backend Engineer'
  },
  {
    id: 3,
    title: 'Interview Reminder',
    message: 'Scheduled interview with Vikram Desai tomorrow at 2:00 PM.',
    time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    type: 'reminder',
    read: true,
    actionUrl: '/recruiter/analytics',
    applicantName: 'Vikram Desai'
  },
  {
    id: 4,
    title: 'New Applications',
    message: '3 new applications received for Full Stack Developer position.',
    time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'application',
    read: false,
    actionUrl: '/recruiter/jobs/3/candidates',
    jobTitle: 'Full Stack Developer'
  },
  {
    id: 5,
    title: 'Job Posting Expires Soon',
    message: 'Your Frontend Developer posting will expire in 3 days.',
    time: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'reminder',
    read: true,
    actionUrl: '/recruiter/my-jobs',
    jobTitle: 'Frontend Developer'
  },
  {
    id: 6,
    title: 'New Application',
    message: 'Neha Sharma applied for Senior React Developer role.',
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'application',
    read: true,
    actionUrl: '/recruiter/jobs/4/candidates',
    applicantName: 'Neha Sharma',
    jobTitle: 'Senior React Developer'
  },
  {
    id: 7,
    title: 'System Update',
    message: 'New candidate filtering features are now available in the dashboard.',
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'system',
    read: false,
    actionUrl: '/recruiter/dashboard'
  },
  {
    id: 8,
    title: 'Application Withdrawn',
    message: 'Rahul Kumar withdrew application for DevOps Engineer position.',
    time: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'status',
    read: true,
    actionUrl: '/recruiter/jobs/5/candidates',
    applicantName: 'Rahul Kumar',
    jobTitle: 'DevOps Engineer'
  },
  {
    id: 9,
    title: 'Bulk Applications',
    message: '5 new applications received across all job postings today.',
    time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'application',
    read: true,
    actionUrl: '/recruiter/dashboard'
  },
  {
    id: 10,
    title: 'Interview Completed',
    message: 'Interview with Sneha Reddy for UI/UX Designer completed.',
    time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'status',
    read: true,
    actionUrl: '/recruiter/jobs/6/candidates',
    applicantName: 'Sneha Reddy',
    jobTitle: 'UI/UX Designer'
  },
  {
    id: 11,
    title: 'Weekly Summary',
    message: 'You received 12 applications this week across 4 job postings.',
    time: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'system',
    read: true,
    actionUrl: '/recruiter/analytics'
  },
  {
    id: 12,
    title: 'Profile Update',
    message: 'Aarav Mehta updated their profile after applying to Data Analyst role.',
    time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'application',
    read: true,
    actionUrl: '/recruiter/jobs/7/candidates',
    applicantName: 'Aarav Mehta',
    jobTitle: 'Data Analyst'
  }
];

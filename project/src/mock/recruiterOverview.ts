export const recruiterOverview = {
  kpis: {
    totalJobs: 6,
    openApplications: 42,
    shortlisted: 7,
    avgResumeScore: 78
  },
  applicantsOverTime: [
    { day: 'Mon', count: 4 },
    { day: 'Tue', count: 5 },
    { day: 'Wed', count: 5 },
    { day: 'Thu', count: 4 },
    { day: 'Fri', count: 3 },
    { day: 'Sat', count: 6 },
    { day: 'Sun', count: 7 }
  ],
  statusBreakdown: [
    { name: 'Shortlisted', value: 7, color: '#10B981' },
    { name: 'Rejected', value: 18, color: '#EF4444' },
    { name: 'Under Review', value: 17, color: '#F59E0B' }
  ],
  recentApplicants: [
    { id: 101, name: 'Arjun R', jobTitle: 'Frontend Intern', score: 84, avatar: null, appliedAt: '2025-10-07', status: 'under_review' },
    { id: 102, name: 'Meera S', jobTitle: 'Data Analyst', score: 72, avatar: null, appliedAt: '2025-10-06', status: 'under_review' },
    { id: 103, name: 'Sanjay K', jobTitle: 'Backend Intern', score: 65, avatar: null, appliedAt: '2025-10-06', status: 'under_review' },
    { id: 104, name: 'Nisha L', jobTitle: 'UI/UX Intern', score: 90, avatar: null, appliedAt: '2025-10-05', status: 'shortlisted' },
    { id: 105, name: 'Rahul P', jobTitle: 'Fullstack Intern', score: 71, avatar: null, appliedAt: '2025-10-04', status: 'under_review' }
  ],
  jobsSnapshot: [
    { id: 1, title: 'Frontend Intern', applicants: 12, avgScore: 79 },
    { id: 2, title: 'Data Analyst Intern', applicants: 8, avgScore: 73 },
    { id: 3, title: 'Backend Intern', applicants: 6, avgScore: 75 }
  ]
};
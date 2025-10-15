import { recruiterOverview } from '../mock/recruiterOverview';
import { mockJobs } from '../mock/jobs';

// Mock job store for persistence
let jobIdCounter = 100;
const jobsStore: any[] = []; // for mock persistence in this module

/**
 * Mock service for recruiter dashboard data
 * React Query key: ["recruiter", "overview"]
 * TODO: Replace with real API calls when backend is ready
 */
export async function getRecruiterOverview() {
  // Simulate network delay for realistic loading states
  await new Promise((resolve) => setTimeout(resolve, 700));
  return recruiterOverview;
}

/**
 * Mock service to shortlist an applicant
 * React Query key: ["recruiter", "applicants"]
 * TODO: Replace with real API endpoint
 */
export async function shortlistApplicant(applicantId: number) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Update mock data (in real app, this would be handled by the backend)
  const applicant = recruiterOverview.recentApplicants.find(a => a.id === applicantId);
  if (applicant) {
    applicant.status = 'shortlisted';
    // Update KPI counts
    recruiterOverview.kpis.shortlisted += 1;
    // Update status breakdown
    const shortlistedStatus = recruiterOverview.statusBreakdown.find(s => s.name === 'Shortlisted');
    const underReviewStatus = recruiterOverview.statusBreakdown.find(s => s.name === 'Under Review');
    if (shortlistedStatus) shortlistedStatus.value += 1;
    if (underReviewStatus) underReviewStatus.value -= 1;
  }
  
  return { success: true, applicantId };
}

/**
 * Mock service to create a new job posting
 * React Query key: ["recruiter", "jobs"] - should be invalidated after creation
 * TODO: Replace with real API endpoint
 */
export async function createJob(jobPayload: any) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const job = { 
    id: jobIdCounter++, 
    createdAt: new Date().toISOString(),
    status: jobPayload.isDraft ? 'draft' : 'published',
    applicantCount: 0,
    ...jobPayload 
  };
  
  jobsStore.push(job);
  
  // In a real app, this would return the created job from the API
  return job;
}

/**
 * Mock service to get analytics data for recruiter
 * React Query key: ["recruiter", "analytics", range]
 * TODO: Replace with real API calls when backend is ready
 */
export async function getAnalytics(range: '7' | '30' | 'custom', customStart?: string, customEnd?: string) {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const { generateAnalyticsData, mockAnalytics7Days, mockAnalytics30Days } = await import('../mock/analytics');

  if (range === '7') {
    return mockAnalytics7Days;
  } else if (range === '30') {
    return mockAnalytics30Days;
  } else {
    if (customStart && customEnd) {
      const start = new Date(customStart);
      const end = new Date(customEnd);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return generateAnalyticsData(days);
    }
    return mockAnalytics7Days;
  }
}

/**
 * Mock service to get all jobs for the recruiter
 * React Query key: ["recruiter", "jobs"]
 * TODO: Replace with real API endpoint
 */
export async function getRecruiterJobs() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...jobsStore, ...mockJobs]; // Combine created jobs with mock data
}

/**
 * Mock service to update job status
 * React Query key: ["recruiter", "jobs"] - should be invalidated after update
 */
export async function updateJobStatus(jobId: number, status: 'Open' | 'Closed') {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Update in jobsStore first
  const jobInStore = jobsStore.find(job => job.id === jobId);
  if (jobInStore) {
    jobInStore.status = status;
    return jobInStore;
  }
  
  // Update in mockJobs
  const jobInMock = mockJobs.find(job => job.id === jobId);
  if (jobInMock) {
    jobInMock.status = status;
    return jobInMock;
  }
  
  throw new Error('Job not found');
}

/**
 * Mock service to delete a job
 * React Query key: ["recruiter", "jobs"] - should be invalidated after deletion
 */
export async function deleteJob(jobId: number) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Remove from jobsStore
  const storeIndex = jobsStore.findIndex(job => job.id === jobId);
  if (storeIndex >= 0) {
    jobsStore.splice(storeIndex, 1);
    return { success: true };
  }
  
  // Remove from mockJobs (in real app, this would be handled by backend)
  const mockIndex = mockJobs.findIndex(job => job.id === jobId);
  if (mockIndex >= 0) {
    mockJobs.splice(mockIndex, 1);
    return { success: true };
  }
  
  throw new Error('Job not found');
}

/**
 * Mock service to get applicants for a specific job
 * React Query key: ["recruiter", "job", jobId, "applicants"]
 * TODO: Replace with real API calls when backend is ready; keep same function names and React Query keys
 */
export async function getJobApplicants(jobId: number, filters?: any) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const { applicantsByJob } = await import('../mock/applicantsByJob');
  let applicants = applicantsByJob[jobId] || [];

  if (filters) {
    if (filters.status) {
      applicants = applicants.filter((a: any) => a.status === filters.status);
    }
    if (filters.minScore !== undefined) {
      applicants = applicants.filter((a: any) => a.score >= filters.minScore);
    }
    if (filters.skills && filters.skills.length > 0) {
      applicants = applicants.filter((a: any) =>
        filters.skills.some((skill: string) => a.skills.includes(skill))
      );
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      applicants = applicants.filter((a: any) =>
        a.name.toLowerCase().includes(searchLower) ||
        a.email.toLowerCase().includes(searchLower)
      );
    }
  }

  return applicants;
}

/**
 * Mock service to get a single application by ID
 * React Query key: ["recruiter", "application", applicationId]
 * TODO: Replace with real API endpoint
 */
export async function getApplication(applicantId: number, jobId: number) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const { applicantsByJob } = await import('../mock/applicantsByJob');
  const jobApplicants = applicantsByJob[jobId];
  const applicant = jobApplicants?.find((a: any) => a.id === applicantId);

  if (!applicant) {
    throw new Error('Applicant not found');
  }

  return applicant;
}

/**
 * Mock service to update application status
 * React Query key: ["recruiter", "job", jobId, "applicants"] - should be invalidated after update
 * TODO: Replace with real API endpoint
 */
export async function updateApplicationStatus(applicantId: number, status: string, jobId: number) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const { applicantsByJob } = await import('../mock/applicantsByJob');
  const jobApplicants = applicantsByJob[jobId];
  const applicant = jobApplicants?.find((a: any) => a.id === applicantId);

  if (applicant) {
    applicant.status = status as any;
  }

  return { success: true, applicantId, status };
}

/**
 * Mock service to send feedback to applicant
 * React Query key: N/A (mutation only)
 * TODO: Replace with real API endpoint
 */
export async function sendFeedback(applicantId: number, message: string, jobId: number) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  console.log(`Feedback sent to applicant ${applicantId}: ${message}`);
  return { success: true };
}

/**
 * Mock service to export applicants as CSV
 * React Query key: N/A (download only)
 * TODO: Replace with real API endpoint
 */
export async function exportApplicantsCSV(jobId: number, selectedIds?: number[]) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { applicantsByJob } = await import('../mock/applicantsByJob');
  let applicants = applicantsByJob[jobId] || [];

  if (selectedIds && selectedIds.length > 0) {
    applicants = applicants.filter((a: any) => selectedIds.includes(a.id));
  }

  const headers = ['Name', 'Email', 'Score', 'Match %', 'Skills', 'Status', 'Applied At'];
  const rows = applicants.map((a: any) => [
    a.name,
    a.email,
    a.score,
    a.match,
    a.skills.join('; '),
    a.status,
    new Date(a.appliedAt).toLocaleDateString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  return blob;
}

/**
 * Mock service to get recruiter notifications
 * React Query key: ["recruiter", "notifications"]
 * TODO: Replace with real API endpoint
 */
export async function getRecruiterNotifications() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { mockRecruiterNotifications } = await import('../mock/notifications');
  return mockRecruiterNotifications;
}

/**
 * Mock service to mark a notification as read
 * React Query key: ["recruiter", "notifications"] - should be invalidated after update
 * TODO: Replace with real API endpoint
 */
export async function markNotificationAsRead(notificationId: number) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const { mockRecruiterNotifications } = await import('../mock/notifications');
  const notification = mockRecruiterNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
  return { success: true, notificationId };
}

/**
 * Mock service to mark all notifications as read
 * React Query key: ["recruiter", "notifications"] - should be invalidated after update
 * TODO: Replace with real API endpoint
 */
export async function markAllNotificationsAsRead() {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const { mockRecruiterNotifications } = await import('../mock/notifications');
  mockRecruiterNotifications.forEach(n => n.read = true);
  return { success: true };
}

import { recruiterOverview } from '../mock/recruiterOverview';
import { mockJobs } from '../mock/jobs';
import axiosInstance from '../api/axiosInstance';

// Mock job store for persistence
let jobIdCounter = 100;
const jobsStore: any[] = []; // for mock persistence in this module

/**
 * Mock service for recruiter dashboard data
 * React Query key: ["recruiter", "overview"]
 * TODO: Replace with real API calls when backend is ready
 */
export async function getRecruiterOverview() {
  try {
    // Fetch all jobs (backend returns postedBy) and filter by current user
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const resp = await axiosInstance.get('/jobs');
    const jobs = resp.data || [];
    const myJobs = user ? jobs.filter((j: any) => String(j.postedBy) === String(user.id) || j.postedBy === user.id) : [];

    // For each job fetch applicants count
    const applicantsPromises = myJobs.map(async (job: any) => {
      try {
        const a = await axiosInstance.get(`/applications/job/${job._id || job.id}`);
        return { jobId: job._id || job.id, applicants: a.data || [] };
      } catch (err) {
        return { jobId: job._id || job.id, applicants: [] };
      }
    });

    const applicantsByJob = await Promise.all(applicantsPromises);

    const totalJobs = myJobs.length;
    const openApplications = applicantsByJob.reduce((s: number, jb: any) => s + (jb.applicants?.length || 0), 0);
    const shortlisted = applicantsByJob.reduce((s: number, jb: any) => s + (jb.applicants?.filter((a: any) => a.status === 'Shortlisted').length || 0), 0);
    const avgResumeScore = 0; // placeholder: scoring requires additional data

    return {
      kpis: { totalJobs, openApplications, shortlisted, avgResumeScore },
      recentApplicants: applicantsByJob.flatMap((jb: any) => jb.applicants).slice(0, 10),
      jobsSnapshot: myJobs.map((j: any) => ({ id: j._id || j.id, title: j.title, applicants: (applicantsByJob.find((x: any) => x.jobId === (j._id || j.id))?.applicants || []).length, avgScore: 0 }))
    };
  } catch (err) {
    // Fallback to mock overview when API unavailable
    await new Promise((resolve) => setTimeout(resolve, 700));
    return recruiterOverview;
  }
}

/**
 * Mock service to shortlist an applicant
 * React Query key: ["recruiter", "applicants"]
 * TODO: Replace with real API endpoint
 */
export async function shortlistApplicant(applicantId: number) {
  try {
    // Update application status to Shortlisted
    const resp = await axiosInstance.put(`/applications/${applicantId}/status`, { status: 'Shortlisted' });
    return resp.data;
  } catch (err) {
    // Fallback to mock behaviour
    await new Promise((resolve) => setTimeout(resolve, 300));
    const applicant = recruiterOverview.recentApplicants.find(a => a.id === applicantId);
    if (applicant) applicant.status = 'shortlisted';
    return { success: true, applicantId };
  }
}

/**
 * Mock service to create a new job posting
 * React Query key: ["recruiter", "jobs"] - should be invalidated after creation
 * TODO: Replace with real API endpoint
 */
export async function createJob(jobPayload: any) {
  // Try real API first
  try {
    // Normalize field names expected by backend: 'type', 'requirements', 'salary_min', 'salary_max'
    const payloadToSend = {
      title: jobPayload.title,
      company: jobPayload.company,
      location: jobPayload.location,
      type: jobPayload.jobType || jobPayload.type,
      description: jobPayload.description,
      requirements: jobPayload.skills || jobPayload.requirements || [],
      salary_min: jobPayload.salaryMin ?? jobPayload.salary_min ?? null,
      salary_max: jobPayload.salaryMax ?? jobPayload.salary_max ?? null,
      isDraft: jobPayload.isDraft,
      currency: jobPayload.currency,
      isRemote: jobPayload.isRemote,
      experienceLevel: jobPayload.experienceLevel,
      deadline: jobPayload.deadline
    };

    const resp = await axiosInstance.post('/jobs', payloadToSend);
    return resp.data;
  } catch (err) {
    // Fallback to mock behaviour if API unavailable
    await new Promise((resolve) => setTimeout(resolve, 500));
    const job = {
      id: jobIdCounter++,
      createdAt: new Date().toISOString(),
      status: jobPayload.isDraft ? 'draft' : 'published',
      applicantCount: 0,
      ...jobPayload
    };
    jobsStore.push(job);
    return job;
  }
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
  try {
    const resp = await axiosInstance.get('/jobs');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const jobs = resp.data || [];
    if (!user) return jobs;
    return jobs.filter((j: any) => String(j.postedBy) === String(user.id) || j.postedBy === user.id);
  } catch (err) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...jobsStore, ...mockJobs];
  }
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
  try {
    const resp = await axiosInstance.get(`/applications/job/${jobId}`);
    let applicants = resp.data || [];

    if (filters) {
      if (filters.status) {
        applicants = applicants.filter((a: any) => a.status === filters.status);
      }
      if (filters.minScore !== undefined) {
        applicants = applicants.filter((a: any) => a.score >= filters.minScore);
      }
      if (filters.skills && filters.skills.length > 0) {
        applicants = applicants.filter((a: any) =>
          filters.skills.some((skill: string) => (a.skills || []).includes(skill))
        );
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        applicants = applicants.filter((a: any) =>
          (a.name || '').toLowerCase().includes(searchLower) ||
          (a.email || '').toLowerCase().includes(searchLower)
        );
      }
    }

    return applicants;
  } catch (err) {
    // fallback to local mock data
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
          filters.skills.some((skill: string) => (a.skills || []).includes(skill))
        );
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        applicants = applicants.filter((a: any) =>
          (a.name || '').toLowerCase().includes(searchLower) ||
          (a.email || '').toLowerCase().includes(searchLower)
        );
      }
    }

    return applicants;
  }
}

/**
 * Mock service to get a single application by ID
 * React Query key: ["recruiter", "application", applicationId]
 * TODO: Replace with real API endpoint
 */
export async function getApplication(applicantId: number, jobId: number) {
  try {
    const resp = await axiosInstance.get(`/applications/job/${jobId}`);
    const applicants = resp.data || [];
    const applicant = applicants.find((a: any) => String(a._id || a.id) === String(applicantId));
    if (!applicant) throw new Error('Applicant not found');
    return applicant;
  } catch (err) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const { applicantsByJob } = await import('../mock/applicantsByJob');
    const jobApplicants = applicantsByJob[jobId];
    const applicant = jobApplicants?.find((a: any) => a.id === applicantId);
    if (!applicant) throw new Error('Applicant not found');
    return applicant;
  }
}

/**
 * Mock service to update application status
 * React Query key: ["recruiter", "job", jobId, "applicants"] - should be invalidated after update
 * TODO: Replace with real API endpoint
 */
export async function updateApplicationStatus(applicantId: number, status: string, jobId: number) {
  try {
    const resp = await axiosInstance.put(`/applications/${applicantId}/status`, { status });
    return resp.data;
  } catch (err) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const { applicantsByJob } = await import('../mock/applicantsByJob');
    const jobApplicants = applicantsByJob[jobId];
    const applicant = jobApplicants?.find((a: any) => a.id === applicantId);
    if (applicant) applicant.status = status as any;
    return { success: true, applicantId, status };
  }
}

/**
 * Mock service to send feedback to applicant
 * React Query key: N/A (mutation only)
 * TODO: Replace with real API endpoint
 */
export async function sendFeedback(applicantId: number, message: string, _jobId?: number) {
  // No backend feedback endpoint available — keep mock behaviour for now
  await new Promise((resolve) => setTimeout(resolve, 400));
  console.log(`Feedback sent to applicant ${applicantId} (job ${_jobId ?? 'N/A'}): ${message}`);
  return { success: true };
}

/**
 * Mock service to export applicants as CSV
 * React Query key: N/A (download only)
 * TODO: Replace with real API endpoint
 */
export async function exportApplicantsCSV(jobId: number, selectedIds?: number[]) {
  try {
    const resp = await axiosInstance.get(`/applications/job/${jobId}`);
    let applicants = resp.data || [];

    if (selectedIds && selectedIds.length > 0) {
      applicants = applicants.filter((a: any) => selectedIds.includes(a.id));
    }

    const headers = ['Name', 'Email', 'Score', 'Match %', 'Skills', 'Status', 'Applied At'];
    const rows = applicants.map((a: any) => [
      a.name,
      a.email,
      a.score,
      a.match,
      (a.skills || []).join('; '),
      a.status,
      new Date(a.appliedAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    return blob;
  } catch (err) {
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

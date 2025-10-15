import { mockAdminJobs, AdminJob } from '../mock/adminJobs';
import { adminAnalytics } from '../mock/adminAnalytics';
import { adminSecurity } from '../mock/adminSecurity';

let jobsState = [...mockAdminJobs];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface JobFilters {
  search?: string;
  status?: string;
  type?: string;
  company?: string;
}

export interface PaginatedJobsResponse {
  items: AdminJob[];
  total: number;
  page: number;
  pageSize: number;
}

export const getAdminJobs = async (
  filters: JobFilters = {},
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedJobsResponse> => {
  await delay(Math.random() * 500 + 200);

  let filtered = [...jobsState];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.recruiter.name.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower)
    );
  }

  if (filters.status && filters.status !== 'All') {
    filtered = filtered.filter(job => job.status === filters.status);
  }

  if (filters.type && filters.type !== 'All') {
    filtered = filtered.filter(job => job.type === filters.type);
  }

  if (filters.company && filters.company !== 'All') {
    filtered = filtered.filter(job => job.company === filters.company);
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    total,
    page,
    pageSize
  };
};

export const approveJob = async (jobId: number): Promise<AdminJob> => {
  await delay(Math.random() * 300 + 200);

  const jobIndex = jobsState.findIndex(job => job.id === jobId);
  if (jobIndex === -1) {
    throw new Error('Job not found');
  }

  jobsState[jobIndex] = {
    ...jobsState[jobIndex],
    status: 'Published'
  };

  return jobsState[jobIndex];
};

export const removeJob = async (jobId: number): Promise<void> => {
  await delay(Math.random() * 300 + 200);

  const jobIndex = jobsState.findIndex(job => job.id === jobId);
  if (jobIndex === -1) {
    throw new Error('Job not found');
  }

  jobsState[jobIndex] = {
    ...jobsState[jobIndex],
    status: 'Removed'
  };
};

export const flagJob = async (jobId: number, reason: string): Promise<AdminJob> => {
  await delay(Math.random() * 300 + 200);

  const jobIndex = jobsState.findIndex(job => job.id === jobId);
  if (jobIndex === -1) {
    throw new Error('Job not found');
  }

  const newFlag = {
    id: Date.now(),
    reason,
    reportedAt: new Date().toISOString().split('T')[0],
    reportedBy: 'Admin'
  };

  jobsState[jobIndex] = {
    ...jobsState[jobIndex],
    status: 'Flagged',
    flags: [...jobsState[jobIndex].flags, newFlag]
  };

  return jobsState[jobIndex];
};

export const updateJob = async (
  jobId: number,
  payload: Partial<AdminJob>
): Promise<AdminJob> => {
  await delay(Math.random() * 400 + 300);

  const jobIndex = jobsState.findIndex(job => job.id === jobId);
  if (jobIndex === -1) {
    throw new Error('Job not found');
  }

  jobsState[jobIndex] = {
    ...jobsState[jobIndex],
    ...payload,
    id: jobId
  };

  return jobsState[jobIndex];
};

export const exportJobsCSV = async (filters: JobFilters = {}): Promise<Blob> => {
  await delay(Math.random() * 500 + 500);

  const response = await getAdminJobs(filters, 1, 1000);
  const jobs = response.items;

  const headers = [
    'ID',
    'Title',
    'Company',
    'Recruiter Name',
    'Recruiter Email',
    'Posted Date',
    'Status',
    'Applicants',
    'Location',
    'Type',
    'Experience',
    'Salary',
    'Flags'
  ];

  const rows = jobs.map(job => [
    job.id,
    job.title,
    job.company,
    job.recruiter.name,
    job.recruiter.email,
    job.postedAt,
    job.status,
    job.applicants,
    job.location,
    job.type,
    job.experience,
    job.salary,
    job.flags.length > 0 ? job.flags.map(f => f.reason).join('; ') : 'None'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};

export const bulkApproveJobs = async (jobIds: number[]): Promise<void> => {
  await delay(Math.random() * 500 + 400);

  jobIds.forEach(jobId => {
    const jobIndex = jobsState.findIndex(job => job.id === jobId);
    if (jobIndex !== -1) {
      jobsState[jobIndex] = {
        ...jobsState[jobIndex],
        status: 'Published'
      };
    }
  });
};

export const bulkRemoveJobs = async (jobIds: number[]): Promise<void> => {
  await delay(Math.random() * 500 + 400);

  jobIds.forEach(jobId => {
    const jobIndex = jobsState.findIndex(job => job.id === jobId);
    if (jobIndex !== -1) {
      jobsState[jobIndex] = {
        ...jobsState[jobIndex],
        status: 'Removed'
      };
    }
  });
};

export const resetJobsState = () => {
  jobsState = [...mockAdminJobs];
};

export const getAdminAnalytics = async () => {
  await delay(700);
  return adminAnalytics;
};

export const getAdminSecurity = async () => {
  await delay(600);
  return adminSecurity;
};

export const terminateSession = async (sessionId: number) => {
  await delay(400);
  console.log(`Session ${sessionId} terminated`);
};

export const blockIP = async (ip: string) => {
  await delay(400);
  console.log(`IP ${ip} blocked`);
};

export const unblockIP = async (ip: string) => {
  await delay(400);
  console.log(`IP ${ip} unblocked`);
};

export const updatePasswordPolicy = async (policy: any) => {
  await delay(500);
  console.log('Password policy updated:', policy);
};

export const update2FASettings = async (settings: any) => {
  await delay(500);
  console.log('2FA settings updated:', settings);
};

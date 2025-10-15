import type { Job, Resume, Application, Notification } from '../types';

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    description: 'We are looking for a passionate Senior Frontend Developer to join our team and help build the future of web applications.',
    requirements: [
      '5+ years of React experience',
      'TypeScript proficiency',
      'Experience with modern build tools',
      'Strong problem-solving skills'
    ],
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Git'],
    location: 'San Francisco, CA',
    type: 'full-time',
    salary: { min: 120000, max: 160000, currency: 'USD' },
    postedAt: '2024-01-20T10:00:00Z',
    applicantCount: 24,
    status: 'active',
    recruiterId: '2'
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    description: 'Join our fast-growing startup and work on cutting-edge technology that impacts millions of users.',
    requirements: [
      '3+ years full-stack development',
      'Node.js and React experience',
      'Database design knowledge',
      'Agile development experience'
    ],
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker'],
    location: 'Remote',
    type: 'full-time',
    salary: { min: 90000, max: 130000, currency: 'USD' },
    postedAt: '2024-01-18T14:30:00Z',
    applicantCount: 18,
    status: 'active',
    recruiterId: '2'
  },
  {
    id: '3',
    title: 'Product Manager Intern',
    company: 'InnovateNow',
    description: 'Learn product management fundamentals while working on real products used by thousands of customers.',
    requirements: [
      'Currently pursuing relevant degree',
      'Strong analytical skills',
      'Excellent communication',
      'Interest in technology products'
    ],
    skills: ['Product Management', 'Analytics', 'User Research', 'Agile'],
    location: 'New York, NY',
    type: 'internship',
    salary: { min: 25, max: 30, currency: 'USD' },
    postedAt: '2024-01-22T09:15:00Z',
    applicantCount: 12,
    status: 'active',
    recruiterId: '2'
  }
];

export const mockResumes: Resume[] = [
  {
    id: '1',
    userId: '1',
    filename: 'John_Doe_Resume.pdf',
    score: 85,
    sections: {
      contact: true,
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: true
    },
    keywords: ['React', 'TypeScript', 'JavaScript', 'Frontend', 'CSS', 'HTML'],
    uploadedAt: '2024-01-15T12:00:00Z',
    lastModified: '2024-01-15T12:00:00Z',
    analysis: {
      grammarScore: 92,
      atsOptimization: 88,
      completeness: 95,
      suggestions: [
        'Add more quantifiable achievements',
        'Include relevant certifications',
        'Optimize keywords for ATS scanning'
      ]
    }
  }
];

export const mockApplications: Application[] = [
  {
    id: '1',
    userId: '1',
    jobId: '1',
    status: 'reviewing',
    submittedAt: '2024-01-20T15:30:00Z',
    recruiterNotes: 'Strong technical background, good portfolio',
    timeline: [
      { status: 'applied', date: '2024-01-20T15:30:00Z', note: 'Application submitted' },
      { status: 'reviewing', date: '2024-01-21T10:00:00Z', note: 'Under review by hiring team' }
    ],
    resumeId: '1'
  },
  {
    id: '2',
    userId: '1',
    jobId: '2',
    status: 'shortlisted',
    submittedAt: '2024-01-18T20:15:00Z',
    recruiterNotes: 'Excellent fit for our startup culture',
    timeline: [
      { status: 'applied', date: '2024-01-18T20:15:00Z', note: 'Application submitted' },
      { status: 'reviewing', date: '2024-01-19T09:00:00Z', note: 'Initial screening passed' },
      { status: 'shortlisted', date: '2024-01-22T14:30:00Z', note: 'Selected for technical interview' }
    ],
    resumeId: '1'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'application_update',
    title: 'Application Status Updated',
    message: 'Your application for Senior Frontend Developer has been shortlisted!',
    read: false,
    createdAt: '2024-01-22T14:30:00Z',
    actionUrl: '/applications/1'
  },
  {
    id: '2',
    userId: '1',
    type: 'resume_feedback',
    title: 'Resume Analysis Complete',
    message: 'Your resume analysis is ready. Score: 85/100',
    read: false,
    createdAt: '2024-01-21T16:45:00Z',
    actionUrl: '/resume'
  },
  {
    id: '3',
    userId: '1',
    type: 'job_match',
    title: 'New Job Match',
    message: '3 new jobs match your profile',
    read: true,
    createdAt: '2024-01-20T11:20:00Z',
    actionUrl: '/jobs'
  }
];
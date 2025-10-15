import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockJobs, mockResumes, mockApplications, mockNotifications } from '../data/mockData';
import type { Job, Resume, Application, Notification } from '../types';

// Simulate API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async (): Promise<Job[]> => {
      await delay(500);
      return mockJobs;
    }
  });
};

export const useResumes = (userId: string) => {
  return useQuery({
    queryKey: ['resumes', userId],
    queryFn: async (): Promise<Resume[]> => {
      await delay(300);
      return mockResumes.filter(resume => resume.userId === userId);
    }
  });
};

export const useApplications = (userId: string) => {
  return useQuery({
    queryKey: ['applications', userId],
    queryFn: async (): Promise<Application[]> => {
      await delay(400);
      return mockApplications.filter(app => app.userId === userId);
    }
  });
};

export const useNotifications = (userId: string) => {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async (): Promise<Notification[]> => {
      await delay(200);
      return mockNotifications.filter(notif => notif.userId === userId);
    }
  });
};

export const useApplyToJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, jobId, resumeId }: { userId: string; jobId: string; resumeId: string }) => {
      await delay(1000);
      
      const newApplication: Application = {
        id: Date.now().toString(),
        userId,
        jobId,
        status: 'applied',
        submittedAt: new Date().toISOString(),
        timeline: [{
          status: 'applied',
          date: new Date().toISOString(),
          note: 'Application submitted'
        }],
        resumeId
      };
      
      mockApplications.push(newApplication);
      return newApplication;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications', variables.userId] });
    }
  });
};

export const useUploadResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }): Promise<Resume> => {
      await delay(2000); // Simulate file upload and AI analysis
      
      const newResume: Resume = {
        id: Date.now().toString(),
        userId,
        filename: file.name,
        score: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
        sections: {
          contact: true,
          summary: Math.random() > 0.3,
          experience: Math.random() > 0.2,
          education: Math.random() > 0.1,
          skills: Math.random() > 0.1,
          projects: Math.random() > 0.4
        },
        keywords: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML'],
        uploadedAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        analysis: {
          grammarScore: Math.floor(Math.random() * 15) + 85,
          atsOptimization: Math.floor(Math.random() * 20) + 75,
          completeness: Math.floor(Math.random() * 10) + 90,
          suggestions: [
            'Add more quantifiable achievements',
            'Include relevant certifications',
            'Optimize keywords for ATS scanning'
          ]
        }
      };
      
      const existingIndex = mockResumes.findIndex(r => r.userId === userId);
      if (existingIndex >= 0) {
        mockResumes[existingIndex] = newResume;
      } else {
        mockResumes.push(newResume);
      }
      
      return newResume;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resumes', variables.userId] });
    }
  });
};
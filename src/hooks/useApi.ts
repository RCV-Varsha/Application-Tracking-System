import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import type { Job, Resume, Application, Notification, ResumeAnalysis } from '../types';

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async (): Promise<Job[]> => {
      const resp = await axiosInstance.get('/jobs');
      return resp.data || [];
    }
  });
};

export const useResumes = (userId: string) => {
  return useQuery({
    queryKey: ['resumes', userId],
    queryFn: async (): Promise<Resume[]> => {
      // No resume API yet — fallback to empty
      return [];
    }
  });
};

export const useApplications = (userId: string) => {
  return useQuery({
    queryKey: ['applications', userId],
    queryFn: async (): Promise<Application[]> => {
      // Call backend endpoint that returns current student's applications
      const resp = await axiosInstance.get('/applications/me');
      return resp.data || [];
    }
  });
};

export const useNotifications = (userId: string) => {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async (): Promise<Notification[]> => {
      // Notifications API not implemented; return empty list for now
      return [];
    }
  });
};

export const useApplyToJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
  mutationFn: async (payload: { userId: string; jobId: string; resumeUrl: string; analysis?: ResumeAnalysis }) => {
      // Call backend apply endpoint (student only) and include analysis if present
      const { jobId, resumeUrl, analysis } = payload;
      const body: Record<string, unknown> = { resumeUrl, coverLetter: '' };
      if (analysis && typeof analysis === 'object') {
        const score = typeof analysis.score !== 'undefined' ? Number(analysis.score) : undefined;
        if (typeof score !== 'undefined') body.aiScore = score;
        body.analysis = analysis;
      }
      const resp = await axiosInstance.post(`/applications/apply/${jobId}`, body);
      return resp.data.application || resp.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applications', (variables as any).userId] });
    }
  });
};

export const useUploadResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }): Promise<Resume> => {
      const formData = new FormData();
      formData.append('file', file);
      type UploadResp = { resumeUrl?: string; url?: string; analysis?: ResumeAnalysis };
      const resp = await axiosInstance.post<UploadResp>('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = resp.data as UploadResp;
      // resp.data: { resumeUrl, analysis }
      return {
        id: Date.now().toString(),
        userId,
        filename: file.name,
        uploadedAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        analysis: (data.analysis as unknown) as Resume['analysis'],
        score: (data.analysis && (data.analysis.score as number)) || 0,
        url: data.resumeUrl || data.url,
        sections: { contact: true, summary: false, experience: false, education: false, skills: false, projects: false },
        keywords: (data.analysis && (data.analysis.keywords as string[])) || []
      } as Resume;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resumes', variables.userId] });
    }
  });
};
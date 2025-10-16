import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance'; 
import { Loader2, Zap, UserCheck, XCircle, Clock, FileText } from 'lucide-react'; 
import { Card } from '../../components/ui/Card'; 
import { Button } from '../../components/ui/Button'; 
import { Badge } from '../../components/ui/Badge'; 
import { CandidateModal } from '../../components/CandidateModal'; 


// Note: This interface reflects the data structure from the live API routes
interface Application {
  _id: string;
  job: { _id: string; title: string; company: string };
  student: { _id: string; name: string; email: string; phone: string };
  status: 'Pending' | 'Reviewed' | 'Interviewing' | 'Rejected' | 'Accepted';
  appliedDate: string;
    resumeUrl?: string;
  score?: number;
  match?: number;
  experience?: string[];
  education?: string[];
  skills?: string[];
  grammarIssues?: string[];
}

interface ApplicationStatusProps {
  status: Application['status'];
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ status }) => {
  let color = 'bg-gray-200 text-gray-800';
  let icon = <Clock className="w-4 h-4 mr-1" />;

  switch (status) {
    case 'Pending':
      color = 'bg-yellow-100 text-yellow-800';
      icon = <Clock className="w-4 h-4 mr-1" />;
      break;
    case 'Reviewed':
      color = 'bg-blue-100 text-blue-800';
      icon = <FileText className="w-4 h-4 mr-1" />;
      break;
    case 'Interviewing':
      color = 'bg-purple-100 text-purple-800';
      icon = <Zap className="w-4 h-4 mr-1" />;
      break;
    case 'Rejected':
      color = 'bg-red-100 text-red-800';
      icon = <XCircle className="w-4 h-4 mr-1" />;
      break;
    case 'Accepted':
      color = 'bg-green-100 text-green-800';
      icon = <UserCheck className="w-4 h-4 mr-1" />;
      break;
  }

  return (
    <Badge className={`inline-flex items-center ${color}`}>
      {icon}
      {status}
    </Badge>
  );
};

export const Candidates: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const queryClient = useQueryClient();
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery<Application[], Error>({
    queryKey: ['jobApplicants', jobId],
    queryFn: async () => {
      // API call using the live backend route: /api/applications/job/:jobId
      const _response = await axiosInstance.get(`/applications/job/${jobId}`);
      return _response.data;
    },
    enabled: !!jobId,
  });

  const statusMutation = useMutation({
    mutationFn: async ({ appId, status }: { appId: string; status: Application['status'] }) => {
      // API call using the live backend route: /api/applications/:appId/status
      const response = await axiosInstance.put(`/applications/${appId}/status`, { status });
      return response.data.application;
    },
    onSuccess: (updatedApplication) => {
      // Update the local cache immediately upon successful status change
      queryClient.setQueryData(['jobApplicants', jobId], (oldData: Application[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(app => 
          app._id === updatedApplication._id ? { ...app, status: updatedApplication.status } : app
        );
      });
      
      // Close modal if status was updated inside it
      if (isModalOpen) {
          setIsModalOpen(false);
          setSelectedCandidate(null); 
      }
      console.log(`Status updated to ${updatedApplication.status}`);
    },
    onError: (err) => {
      console.error('Failed to update status:', err);
    },
  });

  // Display texts in English for clarity across the application
  if (isLoading) return <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" /> Loading applicants...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error loading applicants: {error.message}</div>;
  if (!data || data.length === 0) return <div className="p-8 text-center text-gray-500">No applications found for this job yet.</div>;

  const jobTitle = data[0]?.job?.title || 'Candidates';
  const jobCompany = data[0]?.job?.company || '';
  
  const handleViewCandidate = (candidate: Application) => {
      setSelectedCandidate(candidate);
      setIsModalOpen(true);
  };

const handleUpdateStatus = (appId: string | number, status: Application['status']) => {
  // Convert appId to string for API call, since your backend expects string
  statusMutation.mutate({ appId: String(appId), status });
};



  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Applicants for: {jobTitle}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">{jobCompany}</p>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email/Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {app.student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col">
                        <span>{app.student.email}</span>
                        <span className="text-xs">{app.student.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(app.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ApplicationStatus status={app.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewCandidate(app)}>
                            <FileText className="w-4 h-4 mr-1" /> View
                        </Button>
                        <Button 
                            variant="success" 
                            size="sm" 
                            onClick={() => handleUpdateStatus(app._id, 'Accepted')}
                            disabled={app.status === 'Accepted' || statusMutation.isPending}
                        >
                            <UserCheck className="w-4 h-4" /> Accept
                        </Button>
                        <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => handleUpdateStatus(app._id, 'Rejected')}
                            disabled={app.status === 'Rejected' || statusMutation.isPending}
                        >
                            <XCircle className="w-4 h-4" /> Reject
                        </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
     {/* Candidate Modal for viewing details */}
{isModalOpen && selectedCandidate && (
  <CandidateModal 
    isOpen={isModalOpen} 
    onClose={() => setIsModalOpen(false)} 
    applicant={{
      id: Number(selectedCandidate._id),
      name: selectedCandidate.student.name,
      email: selectedCandidate.student.email,
      appliedAt: selectedCandidate.appliedDate,
      resumeUrl: selectedCandidate.resumeUrl||"", // ✅ if available
      score: selectedCandidate.score || 0,
      match: selectedCandidate.match || 0,
      status: selectedCandidate.status || "Pending",
      parsed: {
        experience: selectedCandidate.experience || [],
        education: selectedCandidate.education || [],
      },
      skills: selectedCandidate.skills || [],
      grammarIssues: selectedCandidate.grammarIssues || [],
    }}
      jobId={Number(jobId) || 0}
 // ✅ pass jobId if required
    onStatusUpdate={handleUpdateStatus}
    isUpdating={statusMutation.isPending}
  />
)}

    </div>
  );
};

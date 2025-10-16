import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { Clock, FileText, Zap, UserCheck, XCircle, Briefcase } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Loader2 } from 'lucide-react';

interface Application {
  _id: string;
  job: { _id: string; title: string; company: string; location: string };
  status: 'Pending' | 'Reviewed' | 'Interviewing' | 'Rejected' | 'Accepted';
  appliedDate: string;
}

interface ApplicationStatusProps {
  status: Application['status'];
}

const ApplicationStatusBadge: React.FC<ApplicationStatusProps> = ({ status }) => {
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
    case 'Accepted':
      color = 'bg-green-100 text-green-800';
      icon = <UserCheck className="w-4 h-4 mr-1" />;
      break;
    case 'Rejected':
      color = 'bg-red-100 text-red-800';
      icon = <XCircle className="w-4 h-4 mr-1" />;
      break;
  }

  return (
    <Badge className={`inline-flex items-center ${color} font-semibold`}>
      {icon}
      {status}
    </Badge>
  );
};

export const ApplicationsList: React.FC = () => {
  const { data: applications, isLoading, error } = useQuery<Application[], Error>({
    queryKey: ['myApplications'],
    queryFn: async () => {
      const response = await axiosInstance.get('/applications/me');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
        <p className="mt-2 text-gray-500">Loading your applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading applications: {error.message}
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Briefcase className="w-12 h-12 mx-auto mb-4" />
        <p className="text-lg font-medium">You haven't applied for any jobs yet.</p>
        <p className="mt-2 text-sm">Find exciting opportunities in the Jobs section!</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Job Applications</h1>
      
      <div className="space-y-4">
        {applications.map((app) => (
          <Card key={app._id} className="p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-3 sm:mb-0">
                <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                  {app.job.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {app.job.company} &middot; <span className="text-sm text-gray-500">{app.job.location}</span>
                </p>
              </div>
              
              <div className="flex flex-col items-start sm:items-end space-y-2">
                <ApplicationStatusBadge status={app.status} />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Applied on: {new Date(app.appliedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

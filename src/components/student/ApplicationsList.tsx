import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Clock,
  Eye,
  Download,
  Building,
  MapPin,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAuthStore } from '../../store/authStore';
import { useApplicationStore } from '../../store/applicationStore';
import { mockJobs } from '../../data/mockJobs';

export const ApplicationsList: React.FC = () => {
  const { user } = useAuthStore();
  const { getApplicationsByUser } = useApplicationStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const applications = getApplicationsByUser(user?.id || '');
  
  const filteredApplications = applications.filter(app => {
    const job = mockJobs.find(j => j.id === app.jobId);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = !searchTerm || 
      job?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job?.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'default';
      case 'reviewing': return 'info';
      case 'shortlisted': return 'warning';
      case 'interviewing': return 'warning';
      case 'offered': return 'success';
      case 'rejected': return 'danger';
      default: return 'default';
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMatchColor = (match?: number) => {
    if (!match) return 'text-gray-500';
    if (match >= 70) return 'text-green-600 dark:text-green-400';
    if (match >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const statusOptions = [
    'all',
    'applied',
    'reviewing',
    'shortlisted',
    'interviewing',
    'offered',
    'rejected'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track the status of your job applications
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredApplications.length} applications
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((application, index) => {
            const job = mockJobs.find(j => j.id === application.jobId);
            if (!job) return null;

            return (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {job.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <div className="flex items-center space-x-1">
                              <Building className="w-4 h-4" />
                              <span>{job.company}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>Applied {new Date(application.submittedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </div>

                      {/* Resume Info */}
                      {application.resumeFilename && (
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <span>Resume: {application.resumeFilename}</span>
                          {application.resumeScore && (
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="w-4 h-4" />
                              <span className={getScoreColor(application.resumeScore)}>
                                Score: {application.resumeScore}/100
                              </span>
                            </div>
                          )}
                          {application.matchPercentage && (
                            <span className={getMatchColor(application.matchPercentage)}>
                              Match: {application.matchPercentage}%
                            </span>
                          )}
                        </div>
                      )}

                      {/* Timeline */}
                      <div className="flex items-center space-x-2">
                        {application.timeline.slice(-3).map((event, idx) => (
                          <div key={idx} className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>{event.status}</span>
                            {idx < application.timeline.slice(-3).length - 1 && (
                              <div className="w-4 h-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Link to={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Job
                        </Button>
                      </Link>
                      {application.resumeFilename && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Resume
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Applications Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {applications.length === 0 
              ? "You haven't applied to any jobs yet. Start browsing opportunities!"
              : "No applications match your current filters."
            }
          </p>
          <Link to="/jobs">
            <Button>
              Browse Jobs
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
};
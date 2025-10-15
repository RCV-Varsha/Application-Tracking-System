import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Download
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAuthStore } from '../../store/authStore';
import { useApplications, useResumes, useJobs } from '../../hooks/useApi';
import { ResumeScoreChart } from './ResumeScoreChart';
import { ApplicationsChart } from './ApplicationsChart';
import { useApplicationStore } from '../../store/applicationStore';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { getApplicationsByUser } = useApplicationStore();
  const { data: resumes, isLoading: resumesLoading } = useResumes(user?.id || '');
  const { data: jobs } = useJobs();

  const applications = getApplicationsByUser(user?.id || '');
  const currentResume = resumes?.[0];
  const recentApplications = applications?.slice(0, 3) || [];
  const recommendedJobs = jobs?.slice(0, 3) || [];

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

  const stats = [
    {
      icon: Briefcase,
      label: 'Applications',
      value: applications?.length || 0,
      change: '+12%',
      color: 'bg-blue-500'
    },
    {
      icon: Eye,
      label: 'Profile Views',
      value: 24,
      change: '+8%',
      color: 'bg-green-500'
    },
    {
      icon: CheckCircle,
      label: 'Interview Rate',
      value: '18%',
      change: '+5%',
      color: 'bg-purple-500'
    },
    {
      icon: TrendingUp,
      label: 'Resume Score',
      value: currentResume?.score || 0,
      change: '+3 pts',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your job applications and optimize your career journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      {stat.change} from last week
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Resume Analysis
              </h2>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
            
            {currentResume ? (
              <div className="space-y-4">
                <ResumeScoreChart score={currentResume.score} />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Grammar</span>
                    <span className="font-medium">{currentResume.analysis.grammarScore}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">ATS Optimization</span>
                    <span className="font-medium">{currentResume.analysis.atsOptimization}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completeness</span>
                    <span className="font-medium">{currentResume.analysis.completeness}/100</span>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        Top Suggestions
                      </h3>
                      <ul className="text-sm text-amber-700 dark:text-amber-300 mt-1 space-y-1">
                        {currentResume.analysis.suggestions.slice(0, 2).map((suggestion, idx) => (
                          <li key={idx}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Resume Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upload your resume to get AI-powered analysis and suggestions
                </p>
                <Button>Upload Resume</Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Application Trends */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Application Trends
            </h2>
            <ApplicationsChart applications={applications || []} />
          </Card>
        </motion.div>
      </div>

      {/* Recent Applications & Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Applications
              </h2>
              <Link to="/applications">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentApplications.map((application) => {
                const job = jobs?.find(j => j.id === application.jobId);
                return (
                  <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {job?.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {job?.company}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(application.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recommended Jobs
              </h2>
              <Link to="/jobs">
                <Button variant="outline" size="sm">
                  View All Jobs
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <div key={job.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {job.company} • {job.location}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Badge variant="info" className="ml-4">
                      92% match
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
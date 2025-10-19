import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  UserCheck,
  TrendingUp,
  Plus,
  Star,
  Calendar,
  Copy,
  Check,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { getRecruiterOverview, shortlistApplicant } from '../../services/mockRecruiterService';

// Skeleton components for loading states
const KPISkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </Card>
    ))}
  </div>
);

const ApplicantsSkeleton = () => (
  <Card className="p-6">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

const ChartsSkeleton = () => (
  <div className="space-y-6">
    <Card className="p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </Card>
    <Card className="p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </Card>
  </div>
);

export const RecruiterDashboard: React.FC = () => {
  const [copiedJobId, setCopiedJobId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const queryClient = useQueryClient();

  // React Query for fetching overview data
  // Key: ["recruiter", "overview"] - used for caching and invalidation
  const { data: overview, isLoading, error } = useQuery<any, Error>({
    queryKey: ['recruiter', 'overview'],
    queryFn: getRecruiterOverview,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for shortlisting applicants
  const shortlistMutation = useMutation({
    mutationFn: shortlistApplicant,
    onSuccess: () => {
      // Invalidate and refetch overview data to update UI
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'overview'] });
      showToast('Applicant shortlisted successfully!', 'success');
    },
    onError: () => {
      showToast('Failed to shortlist applicant. Please try again.', 'error');
    },
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Defensive defaults merged with any partial overview returned by the API.
  // This ensures nested fields (arrays/objects) are always present.
  const overviewDefaults = {
    kpis: { totalJobs: 0, openApplications: 0, shortlisted: 0, avgResumeScore: 0 },
    recentApplicants: [] as any[],
    jobsSnapshot: [] as any[],
    applicantsOverTime: [] as any[],
    statusBreakdown: [] as any[],
  };

  const overviewSafe: any = { ...overviewDefaults, ...(overview || {}) };

  const handleShortlist = (applicantId: number) => {
    shortlistMutation.mutate(applicantId);
  };

  const handleCopyJobLink = async (jobId: number) => {
    const jobLink = `${window.location.origin}/jobs/${jobId}`;
    try {
      await navigator.clipboard.writeText(jobLink);
      setCopiedJobId(jobId);
      showToast('Job link copied to clipboard!', 'success');
      setTimeout(() => setCopiedJobId(null), 2000);
    } catch (err) {
      showToast('Failed to copy link', 'error');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const generateAvatar = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-cyan-500'
    ];
    const colorIndex = name.charCodeAt(0) % colors.length;
    return { initials, colorClass: colors[colorIndex] };
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Failed to load dashboard</div>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['recruiter', 'overview'] })}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Recruiter Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your hiring pipeline and track candidate progress
          </p>
        </div>
        <Link to="/recruiter/post-job">
          <Button size="lg" className="shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <KPISkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
                  <Card hover className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Jobs
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {overviewSafe.kpis.totalJobs}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +2 this month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card hover className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Open Applications
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {overviewSafe.kpis.openApplications}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +12 this week
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card hover className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Shortlisted
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {overviewSafe.kpis.shortlisted}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +3 today
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>

          <Card hover className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg Resume Score
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {overviewSafe.kpis.avgResumeScore}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +5 pts this month
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applicants - Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Applicants */}
          {isLoading ? (
            <ApplicantsSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Recent Applicants
                  </h2>
                  <Link to="/recruiter/candidates">
                    <Button variant="outline" size="sm">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                {overviewSafe.recentApplicants.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No applicants yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Share your job links to start receiving applications
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {(overviewSafe.jobsSnapshot || []).map((job: any) => (
                        <Button
                          key={job.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyJobLink(job.id)}
                          className="flex items-center"
                        >
                          {copiedJobId === job.id ? (
                            <Check className="w-4 h-4 mr-2 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 mr-2" />
                          )}
                          Copy {job.title} Link
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(overviewSafe.recentApplicants || []).map((applicant: any, index: number) => {
                      const avatar = generateAvatar(applicant.name);
                      return (
                        <motion.div
                          key={applicant.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 ${avatar.colorClass} rounded-full flex items-center justify-center text-white font-semibold`}>
                              {avatar.initials}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {applicant.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {applicant.jobTitle}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Applied {new Date(applicant.appliedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant={getScoreBadgeVariant(applicant.score)}>
                              <Star className="w-3 h-3 mr-1" />
                              {applicant.score}
                            </Badge>
                            {applicant.status !== 'shortlisted' && (
                              <Button
                                size="sm"
                                onClick={() => handleShortlist(applicant.id)}
                                disabled={Boolean((shortlistMutation as any).isLoading)}
                                loading={Boolean((shortlistMutation as any).isLoading) && (shortlistMutation as any).variables === applicant.id}
                                aria-label={`Shortlist ${applicant.name}`}
                              >
                                <UserCheck className="w-4 h-4 mr-1" />
                                Shortlist
                              </Button>
                            )}
                            {applicant.status === 'shortlisted' && (
                              <Badge variant="success">
                                <UserCheck className="w-3 h-3 mr-1" />
                                Shortlisted
                              </Badge>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* Jobs Snapshot */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Jobs Snapshot
                  </h2>
                  <Link to="/recruiter/jobs">
                    <Button variant="outline" size="sm">
                      Manage Jobs
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(overviewSafe.jobsSnapshot || []).map((job: any, index: number) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card hover className="p-4 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20 border-indigo-200 dark:border-indigo-800">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                          {job.title}
                        </h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Applicants</span>
                            <span className="font-medium text-gray-900 dark:text-white">{job.applicants}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Avg Score</span>
                            <span className={`font-medium ${getScoreColor(job.avgScore)}`}>
                              {job.avgScore}
                            </span>
                          </div>
                        </div>
                        <Link to={`/recruiter/jobs/${job.id}/candidates`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Candidates
                          </Button>
                        </Link>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Charts - Right Column */}
        <div className="space-y-6">
          {isLoading ? (
            <ChartsSkeleton />
          ) : (
            <>
              {/* Applicants Over Time Chart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Applicants This Week
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={overviewSafe.applicantsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false}
                        tickLine={false}
                        className="text-sm text-gray-600 dark:text-gray-400"
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        className="text-sm text-gray-600 dark:text-gray-400"
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--tooltip-bg)',
                          border: '1px solid var(--tooltip-border)',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#4F46E5" 
                        strokeWidth={3}
                        dot={{ fill: '#4F46E5', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7, stroke: '#4F46E5', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              {/* Status Breakdown Donut Chart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Application Status
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={overviewSafe.statusBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {(overviewSafe.statusBreakdown || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'var(--tooltip-bg)',
                          border: '1px solid var(--tooltip-border)',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {(overviewSafe.statusBreakdown || []).map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className={`px-6 py-3 rounded-2xl shadow-lg ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center space-x-2">
              {toast.type === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Download,
  RefreshCw
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { JobCard } from '../../components/admin/JobCard';
import { JobTable } from '../../components/admin/JobTable';
import { JobDetailModal } from '../../components/admin/JobDetailModal';
import { BulkActionsBar } from '../../components/admin/BulkActionsBar';
import {
  getAdminJobs,
  approveJob,
  removeJob,
  flagJob,
  exportJobsCSV,
  bulkApproveJobs,
  bulkRemoveJobs,
  JobFilters
} from '../../services/mockAdminService';
import { AdminJob } from '../../mock/adminJobs';

type ViewMode = 'grid' | 'table';

export const JobManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedJobIds, setSelectedJobIds] = useState<number[]>([]);
  const [selectedJob, setSelectedJob] = useState<AdminJob | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const queryClient = useQueryClient();

  const filters: JobFilters = useMemo(
    () => ({
      search: searchQuery,
      status: statusFilter,
      type: typeFilter
    }),
    [searchQuery, statusFilter, typeFilter]
  );

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'jobs', filters, 1],
    queryFn: () => getAdminJobs(filters, 1, 100)
  });

  const approveMutation = useMutation({
    mutationFn: approveJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
    }
  });

  const removeMutation = useMutation({
    mutationFn: removeJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
    }
  });

  const flagMutation = useMutation({
    mutationFn: ({ jobId, reason }: { jobId: number; reason: string }) =>
      flagJob(jobId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
    }
  });

  const bulkApproveMutation = useMutation({
    mutationFn: bulkApproveJobs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
      setSelectedJobIds([]);
    }
  });

  const bulkRemoveMutation = useMutation({
    mutationFn: bulkRemoveJobs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] });
      setSelectedJobIds([]);
    }
  });

  const handleSelectJob = (jobId: number) => {
    setSelectedJobIds(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleViewDetails = (job: AdminJob) => {
    setSelectedJob(job);
    setShowDetailModal(true);
  };

  const handleExport = async () => {
    try {
      const blob = await exportJobsCSV(filters);
      saveAs(blob, `jobs-export-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export jobs');
    }
  };

  const handleBulkApprove = () => {
    if (
      window.confirm(
        `Are you sure you want to approve ${selectedJobIds.length} job(s)?`
      )
    ) {
      bulkApproveMutation.mutate(selectedJobIds);
    }
  };

  const handleBulkRemove = () => {
    if (
      window.confirm(
        `Are you sure you want to remove ${selectedJobIds.length} job(s)?`
      )
    ) {
      bulkRemoveMutation.mutate(selectedJobIds);
    }
  };

  const stats = useMemo(() => {
    const jobs = data?.items || [];
    return {
      total: jobs.length,
      pending: jobs.filter(j => j.status === 'Pending').length,
      published: jobs.filter(j => j.status === 'Published').length,
      flagged: jobs.filter(j => j.status === 'Flagged').length,
      removed: jobs.filter(j => j.status === 'Removed').length
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Job Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review, moderate, and manage all job postings
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Jobs</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.pending}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.published}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Published</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.flagged}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Flagged</p>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {stats.removed}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Removed</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs by title, company, location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="pl-9 pr-8 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Published">Published</option>
                  <option value="Flagged">Flagged</option>
                  <option value="Removed">Removed</option>
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="pl-9 pr-8 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Intern">Intern</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div className="flex gap-1 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'table'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title="Table view"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : !data?.items.length ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                No jobs found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          ) : viewMode === 'table' ? (
            <JobTable
              jobs={data.items}
              onSelect={handleSelectJob}
              selectedIds={selectedJobIds}
              onViewDetails={handleViewDetails}
              onApprove={jobId => approveMutation.mutate(jobId)}
              onRemove={jobId => removeMutation.mutate(jobId)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.items.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSelect={handleSelectJob}
                  isSelected={selectedJobIds.includes(job.id)}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {data && data.items.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {data.items.length}
                </span>{' '}
                of{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {data.total}
                </span>{' '}
                jobs
              </p>
            </div>
          )}
        </div>
      </Card>

      <BulkActionsBar
        selectedCount={selectedJobIds.length}
        onClearSelection={() => setSelectedJobIds([])}
        onBulkApprove={handleBulkApprove}
        onBulkRemove={handleBulkRemove}
      />

      <JobDetailModal
        job={selectedJob}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedJob(null);
        }}
        onApprove={jobId => approveMutation.mutate(jobId)}
        onRemove={jobId => removeMutation.mutate(jobId)}
        onFlag={(jobId, reason) => flagMutation.mutate({ jobId, reason })}
      />
    </div>
  );
};

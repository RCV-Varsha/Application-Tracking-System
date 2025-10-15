import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Flag, CheckCircle, XCircle } from 'lucide-react';
import { AdminJob } from '../../mock/adminJobs';
import { Badge } from '../ui/Badge';

interface JobTableProps {
  jobs: AdminJob[];
  onSelect?: (jobId: number) => void;
  selectedIds?: number[];
  onViewDetails: (job: AdminJob) => void;
  onApprove?: (jobId: number) => void;
  onRemove?: (jobId: number) => void;
}

export const JobTable: React.FC<JobTableProps> = ({
  jobs,
  onSelect,
  selectedIds = [],
  onViewDetails,
  onApprove,
  onRemove
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Published':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Flagged':
        return 'danger';
      case 'Removed':
        return 'default';
      default:
        return 'default';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'Full-time':
        return 'info';
      case 'Part-time':
        return 'info';
      case 'Intern':
        return 'success';
      case 'Contract':
        return 'default';
      default:
        return 'default';
    }
  };

  const allSelected = jobs.length > 0 && jobs.every(job => selectedIds.includes(job.id));
  const someSelected = jobs.some(job => selectedIds.includes(job.id)) && !allSelected;

  const handleSelectAll = () => {
    if (!onSelect) return;

    if (allSelected) {
      jobs.forEach(job => {
        if (selectedIds.includes(job.id)) {
          onSelect(job.id);
        }
      });
    } else {
      jobs.forEach(job => {
        if (!selectedIds.includes(job.id)) {
          onSelect(job.id);
        }
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {onSelect && (
              <th className="text-left py-3 px-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={input => {
                    if (input) {
                      input.indeterminate = someSelected;
                    }
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
            )}
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
              Job Title
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
              Company
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
              Status
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
              Type
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
              Applicants
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
              Posted
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <motion.tr
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                selectedIds.includes(job.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''
              }`}
            >
              {onSelect && (
                <td className="py-4 px-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(job.id)}
                    onChange={() => onSelect(job.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
              )}
              <td className="py-4 px-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {job.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {job.location}
                  </p>
                </div>
              </td>
              <td className="py-4 px-4">
                <p className="text-sm text-gray-900 dark:text-white">
                  {job.company}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {job.recruiter.name}
                </p>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(job.status)}>
                    {job.status}
                  </Badge>
                  {job.flags.length > 0 && (
                    <Badge variant="danger" size="sm">
                      <Flag className="w-3 h-3" />
                    </Badge>
                  )}
                </div>
              </td>
              <td className="py-4 px-4">
                <Badge variant={getTypeBadgeVariant(job.type)} size="sm">
                  {job.type}
                </Badge>
              </td>
              <td className="py-4 px-4">
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  {job.applicants}
                </p>
              </td>
              <td className="py-4 px-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(job.postedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onViewDetails(job)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {job.status === 'Pending' && onApprove && (
                    <button
                      onClick={() => onApprove(job.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Approve job"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {job.status !== 'Removed' && onRemove && (
                    <button
                      onClick={() => onRemove(job.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove job"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Calendar, Users, Flag, Eye } from 'lucide-react';
import { AdminJob } from '../../mock/adminJobs';
import { Badge } from '../ui/Badge';

interface JobCardProps {
  job: AdminJob;
  onSelect?: (jobId: number) => void;
  isSelected?: boolean;
  onViewDetails: (job: AdminJob) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onSelect,
  isSelected,
  onViewDetails
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-900 rounded-xl border-2 transition-all ${
        isSelected
          ? 'border-blue-500 shadow-lg'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            {onSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(job.id)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                {job.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {job.company}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant={getStatusBadgeVariant(job.status)}>
                  {job.status}
                </Badge>
                <Badge variant={getTypeBadgeVariant(job.type)}>
                  {job.type}
                </Badge>
                {job.flags.length > 0 && (
                  <Badge variant="danger">
                    <Flag className="w-3 h-3 mr-1" />
                    {job.flags.length} Flag{job.flags.length > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {job.excerpt}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Briefcase className="w-4 h-4" />
            <span className="truncate">{job.experience}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="truncate">
              {new Date(job.postedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>{job.applicants} Applicants</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="text-gray-500 dark:text-gray-400">Recruiter</p>
              <p className="text-gray-900 dark:text-white font-medium">
                {job.recruiter.name}
              </p>
            </div>
            <button
              onClick={() => onViewDetails(job)}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

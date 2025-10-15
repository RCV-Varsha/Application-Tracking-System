import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle,
  XCircle,
  Flag,
  MapPin,
  Briefcase,
  Calendar,
  Users,
  Mail,
  Building,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { AdminJob } from '../../mock/adminJobs';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface JobDetailModalProps {
  job: AdminJob | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (jobId: number) => void;
  onRemove?: (jobId: number) => void;
  onFlag?: (jobId: number, reason: string) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onApprove,
  onRemove,
  onFlag
}) => {
  const [showFlagInput, setShowFlagInput] = useState(false);
  const [flagReason, setFlagReason] = useState('');

  if (!job) return null;

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

  const handleFlag = () => {
    if (flagReason.trim() && onFlag) {
      onFlag(job.id, flagReason);
      setFlagReason('');
      setShowFlagInput(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col my-8"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Job Details
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Review and manage job posting
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {job.title}
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                          {job.company}
                        </p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {job.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Briefcase className="w-4 h-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(job.postedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{job.applicants} Applicants</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Recruiter Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Name:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {job.recruiter.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Email:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {job.recruiter.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Company:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {job.recruiter.company || job.company}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {job.experience}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Compensation
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">{job.salary}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Job Description
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {job.description || job.excerpt}
                    </p>
                  </div>

                  {job.requirements && job.requirements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => (
                          <Badge key={index} variant="info">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.flags.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-3 flex items-center gap-2">
                        <Flag className="w-4 h-4" />
                        Flags ({job.flags.length})
                      </h4>
                      <div className="space-y-2">
                        {job.flags.map(flag => (
                          <div
                            key={flag.id}
                            className="text-sm bg-white dark:bg-gray-900 p-3 rounded-lg"
                          >
                            <p className="text-gray-900 dark:text-white font-medium mb-1">
                              {flag.reason}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Reported on {flag.reportedAt}
                              {flag.reportedBy && ` by ${flag.reportedBy}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {showFlagInput && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Flag This Job
                      </h4>
                      <textarea
                        value={flagReason}
                        onChange={e => setFlagReason(e.target.value)}
                        placeholder="Enter reason for flagging this job..."
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                        rows={3}
                      />
                      <div className="flex gap-2 mt-3">
                        <Button onClick={handleFlag} size="sm">
                          Submit Flag
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowFlagInput(false);
                            setFlagReason('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex gap-2">
                  {job.status === 'Pending' && onApprove && (
                    <Button
                      onClick={() => {
                        onApprove(job.id);
                        onClose();
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Job
                    </Button>
                  )}
                  {job.status !== 'Removed' && onRemove && (
                    <Button
                      onClick={() => {
                        if (
                          window.confirm(
                            'Are you sure you want to remove this job posting?'
                          )
                        ) {
                          onRemove(job.id);
                          onClose();
                        }
                      }}
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Remove Job
                    </Button>
                  )}
                  {job.status !== 'Flagged' && onFlag && !showFlagInput && (
                    <Button
                      onClick={() => setShowFlagInput(true)}
                      variant="outline"
                      className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Flag Job
                    </Button>
                  )}
                </div>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

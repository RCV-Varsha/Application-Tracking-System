import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import {
  X,
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
  MessageSquare,
  Briefcase,
  GraduationCap,
  Award,
  AlertCircle
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateApplicationStatus, sendFeedback } from '../services/mockRecruiterService';
import type { Applicant } from '../mock/applicantsByJob';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: {
    id: number;
    name: string;
    email: string;
    appliedAt: string;
    resumeUrl: string;
    score: number;
    match: number;
    status: 'Pending' | 'Reviewed' | 'Interviewing' | 'Rejected' | 'Accepted';
    parsed: {
      experience: string[];
      education: string[];
    };
    skills: string[];
    grammarIssues: string[];
  };
  jobId: number;
  onStatusUpdate?: (appId: number | string, status: 'Pending' | 'Reviewed' | 'Interviewing' | 'Rejected' | 'Accepted') => void; // ✅ add this
  isUpdating?: boolean;
}


export const CandidateModal: React.FC<CandidateModalProps> = ({
  isOpen,
  onClose,
  applicant,
  jobId,
    onStatusUpdate, // ✅ now exists
  isUpdating,
}) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => updateApplicationStatus(applicant.id, status, jobId),
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ['recruiter', 'job', jobId, 'applicants'] });
      const previousData = queryClient.getQueryData(['recruiter', 'job', jobId, 'applicants']);
      queryClient.setQueryData(['recruiter', 'job', jobId, 'applicants'], (old: any) => {
        return old?.map((a: any) =>
          a.id === applicant.id ? { ...a, status: newStatus } : a
        );
      });
      return { previousData };
    },
    onError: (err, newStatus, context) => {
      queryClient.setQueryData(['recruiter', 'job', jobId, 'applicants'], context?.previousData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'job', jobId, 'applicants'] });
    }
  });

  const feedbackMutation = useMutation({
    mutationFn: (message: string) => sendFeedback(applicant.id, message, jobId),
    onSuccess: () => {
      setShowFeedbackModal(false);
      setFeedbackMessage('');
    }
  });

  const handleStatusChange = (status: string) => {
    updateStatusMutation.mutate(status);
  };

  const handleSendFeedback = () => {
    if (feedbackMessage.trim()) {
      feedbackMutation.mutate(feedbackMessage);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
    if (score >= 70) return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
    return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Request Update':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl transition-all">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                        {applicant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                          {applicant.name}
                        </Dialog.Title>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{applicant.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getScoreColor(applicant.score)}>
                          Score: {applicant.score}
                        </Badge>
                        <Badge className="bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400">
                          Match: {applicant.match}%
                        </Badge>
                        <Badge className={getStatusColor(applicant.status)}>
                          {applicant.status}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Resume</h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => window.open(applicant.resumeUrl, '_blank')}
                              className="p-2 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors"
                              title="View in new tab"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <a
                              href={applicant.resumeUrl}
                              download
                              className="p-2 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 rounded-lg h-96 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                          <iframe
                            src={applicant.resumeUrl}
                            className="w-full h-full rounded-lg"
                            title="Resume Preview"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Briefcase className="w-5 h-5 text-cyan-600" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">Experience</h3>
                        </div>
                        <ul className="space-y-2">
                          {applicant.parsed.experience.map((exp, idx) => (
                            <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                              <span className="text-cyan-600 mr-2">•</span>
                              {exp}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <GraduationCap className="w-5 h-5 text-cyan-600" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">Education</h3>
                        </div>
                        <ul className="space-y-2">
                          {applicant.parsed.education.map((edu, idx) => (
                            <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                              <span className="text-cyan-600 mr-2">•</span>
                              {edu}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Award className="w-5 h-5 text-cyan-600" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">Skills</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {applicant.skills.map((skill, idx) => (
                            <Badge key={idx} className="bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {applicant.grammarIssues.length > 0 && (
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                          <div className="flex items-center space-x-2 mb-3">
                            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            <h3 className="font-semibold text-orange-900 dark:text-orange-300">Issues Found</h3>
                          </div>
                          <ul className="space-y-2">
                            {applicant.grammarIssues.map((issue, idx) => (
                              <li key={idx} className="text-sm text-orange-800 dark:text-orange-300 flex items-start">
                                <span className="text-orange-600 dark:text-orange-400 mr-2">•</span>
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Applied {new Date(applicant.appliedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFeedbackModal(true)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Request Update
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange('Rejected')}
                        disabled={updateStatusMutation.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange('Shortlisted')}
                        disabled={updateStatusMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Shortlist
                      </Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={showFeedbackModal} as={Fragment}>
        <Dialog as="div" className="relative z-[60]" onClose={() => setShowFeedbackModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl transition-all">
                  <div className="p-6">
                    <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Request Update from {applicant.name}
                    </Dialog.Title>
                    <textarea
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Enter your feedback or request for the candidate..."
                      className="w-full h-32 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                    />
                    <div className="flex justify-end space-x-3 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFeedbackModal(false)}
                        disabled={feedbackMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSendFeedback}
                        disabled={!feedbackMessage.trim() || feedbackMutation.isPending}
                      >
                        Send Feedback
                      </Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

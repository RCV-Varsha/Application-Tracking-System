import React from 'react';
import { motion } from 'framer-motion';
import { Eye, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import type { Applicant } from '../mock/applicantsByJob';
import { Badge } from './ui/Badge';
import { useCandidatesUIStore } from '../store/uiStore';

interface ApplicantsTableProps {
  applicants: Applicant[];
  onViewApplicant: (applicant: Applicant) => void;
  onStatusChange: (applicantId: number, status: string) => void;
  onRequestUpdate: (applicant: Applicant) => void;
}

export const ApplicantsTable: React.FC<ApplicantsTableProps> = ({
  applicants,
  onViewApplicant,
  onStatusChange,
  onRequestUpdate
}) => {
  const { selectedApplicants, toggleApplicantSelection, setSelectedApplicants } = useCandidatesUIStore();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedApplicants(applicants.map(a => a.id));
    } else {
      setSelectedApplicants([]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 70) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
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

  const allSelected = applicants.length > 0 && selectedApplicants.length === applicants.length;
  const someSelected = selectedApplicants.length > 0 && selectedApplicants.length < applicants.length;

  return (
    <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
          <tr>
            <th className="px-6 py-4 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => el && (el.indeterminate = someSelected)}
                onChange={handleSelectAll}
                className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Candidate
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Match
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Skills
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Applied
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {applicants.map((applicant) => (
            <motion.tr
              key={applicant.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedApplicants.includes(applicant.id)}
                  onChange={() => toggleApplicantSelection(applicant.id)}
                  className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {applicant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{applicant.name}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {applicant.email}
              </td>
              <td className="px-6 py-4">
                <Badge className={getScoreColor(applicant.score)}>
                  {applicant.score}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <Badge className="bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400">
                  {applicant.match}%
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {applicant.skills.slice(0, 2).map((skill, idx) => (
                    <Badge key={idx} className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {applicant.skills.length > 2 && (
                    <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs">
                      +{applicant.skills.length - 2}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {new Date(applicant.appliedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </td>
              <td className="px-6 py-4">
                <Badge className={getStatusColor(applicant.status)}>
                  {applicant.status}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onViewApplicant(applicant)}
                    className="p-2 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {applicant.status !== 'Shortlisted' && (
                    <button
                      onClick={() => onStatusChange(applicant.id, 'Shortlisted')}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Shortlist"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {applicant.status !== 'Rejected' && (
                    <button
                      onClick={() => onStatusChange(applicant.id, 'Rejected')}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onRequestUpdate(applicant)}
                    className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                    title="Request Update"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

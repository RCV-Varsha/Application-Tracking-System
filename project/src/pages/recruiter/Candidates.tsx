import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  MessageSquare,
  ChevronLeft,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { saveAs } from 'file-saver';
import {
  getJobApplicants,
  updateApplicationStatus,
  exportApplicantsCSV,
  getRecruiterJobs
} from '../../services/mockRecruiterService';
import type { Applicant } from '../../mock/applicantsByJob';
import { ApplicantsTable } from '../../components/ApplicantsTable';
import { CandidateModal } from '../../components/CandidateModal';
import { useCandidatesUIStore } from '../../store/uiStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const Candidates: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { selectedApplicants, clearSelection } = useCandidatesUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [minScore, setMinScore] = useState<number>(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackApplicant, setFeedbackApplicant] = useState<Applicant | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const numericJobId = jobId ? parseInt(jobId, 10) : 1;

  const { data: jobs } = useQuery({
    queryKey: ['recruiter', 'jobs'],
    queryFn: getRecruiterJobs
  });

  const currentJob = useMemo(() => {
    return jobs?.find(job => job.id === numericJobId);
  }, [jobs, numericJobId]);

  const filters = useMemo(
    () => ({
      search: searchQuery,
      status: statusFilter,
      minScore,
      skills: selectedSkills
    }),
    [searchQuery, statusFilter, minScore, selectedSkills]
  );

  const {
    data: applicants = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['recruiter', 'job', numericJobId, 'applicants', filters],
    queryFn: () => getJobApplicants(numericJobId, filters),
    staleTime: 30000
  });

  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    applicants.forEach((applicant: Applicant) => {
      applicant.skills.forEach(skill => skillSet.add(skill));
    });
    return Array.from(skillSet).sort();
  }, [applicants]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ applicantId, status }: { applicantId: number; status: string }) =>
      updateApplicationStatus(applicantId, status, numericJobId),
    onMutate: async ({ applicantId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['recruiter', 'job', numericJobId, 'applicants'] });
      const previousData = queryClient.getQueryData(['recruiter', 'job', numericJobId, 'applicants', filters]);
      queryClient.setQueryData(['recruiter', 'job', numericJobId, 'applicants', filters], (old: any) => {
        return old?.map((a: any) => (a.id === applicantId ? { ...a, status } : a));
      });
      return { previousData };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['recruiter', 'job', numericJobId, 'applicants', filters], context?.previousData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'job', numericJobId, 'applicants'] });
    }
  });

  const exportMutation = useMutation({
    mutationFn: () => exportApplicantsCSV(numericJobId, selectedApplicants.length > 0 ? selectedApplicants : undefined),
    onSuccess: (blob) => {
      saveAs(blob, `applicants-job-${numericJobId}-${new Date().toISOString().split('T')[0]}.csv`);
      clearSelection();
    }
  });

  const handleBulkAction = (action: string) => {
    if (selectedApplicants.length === 0) return;

    selectedApplicants.forEach(id => {
      updateStatusMutation.mutate({ applicantId: id, status: action });
    });

    clearSelection();
  };

  const handleCopyJobLink = () => {
    const link = `${window.location.origin}/jobs/${numericJobId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const sortedApplicants = useMemo(() => {
    return [...applicants].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
    });
  }, [applicants]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Applicants
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please try again later
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/recruiter/my-jobs')}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentJob?.title || 'Job'} - Candidates
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {applicants.length} {applicants.length === 1 ? 'applicant' : 'applicants'}
            </p>
          </div>
        </div>

        <Card className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              {selectedApplicants.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('Shortlisted')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Shortlist ({selectedApplicants.length})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('Rejected')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => exportMutation.mutate()}
                disabled={exportMutation.isPending}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                >
                  <option value="">All Statuses</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Request Update">Request Update</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Score: {minScore}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skills
                </label>
                <select
                  multiple
                  value={selectedSkills}
                  onChange={(e) => setSelectedSkills(Array.from(e.target.selectedOptions, option => option.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  size={3}
                >
                  {allSkills.map(skill => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedApplicants.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 border-2 border-dashed border-cyan-200 dark:border-cyan-800">
              <AlertCircle className="w-16 h-16 text-cyan-600 dark:text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Applicants Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Share your job posting to start receiving applications
              </p>
              <Button
                onClick={handleCopyJobLink}
                className="mx-auto"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Job Link
                  </>
                )}
              </Button>
            </Card>
          ) : (
            <>
              <ApplicantsTable
                applicants={sortedApplicants}
                onViewApplicant={(applicant) => setSelectedApplicant(applicant)}
                onStatusChange={(applicantId, status) =>
                  updateStatusMutation.mutate({ applicantId, status })
                }
                onRequestUpdate={(applicant) => {
                  setFeedbackApplicant(applicant);
                  setShowFeedbackModal(true);
                }}
              />

              <div className="md:hidden space-y-4 mt-6">
                {sortedApplicants.map((applicant) => (
                  <Card
                    key={applicant.id}
                    className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedApplicant(applicant)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                          {applicant.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{applicant.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{applicant.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Score: {applicant.score}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Match: {applicant.match}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {applicant.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {selectedApplicant && (
        <CandidateModal
          isOpen={!!selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          applicant={selectedApplicant}
          jobId={numericJobId}
        />
      )}
    </div>
  );
};

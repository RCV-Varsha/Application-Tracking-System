import React, { useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  ArrowLeft,
  Building,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Eye,
  Send
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { mockJobs } from '../../data/mockJobs';
import { type ResumeEvaluation } from '../../services/mockEvaluation';
import type { Application, Resume, ResumeAnalysis } from '../../types';
import { useUploadResume, useApplyToJob, useApplications } from '../../hooks/useApi';
import { useAuthStore } from '../../store/authStore';
import { useApplicationStore } from '../../store/applicationStore';

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addApplication } = useApplicationStore(); // keep local store for offline UI
  const uploadResume = useUploadResume();
  const applyToJob = useApplyToJob();
  const { data: myApplications } = useApplications(user?.id || '');
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [evaluation, setEvaluation] = useState<ResumeAnalysis | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const job = mockJobs.find(j => j.id === id);

  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'view' | 'upload' | 'evaluate' | 'submit'>('view');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && user) {
      setUploadedFile(file);
      setIsEvaluating(true);
      setCurrentStep('evaluate');
      try {
        const resp = await uploadResume.mutateAsync({ userId: user.id, file }) as Resume;
  // safe access to possible url fields returned from upload
  const r = resp as unknown as Record<string, unknown>;
  setResumeUrl((r.url as string) || (r.fileUrl as string) || (r.resumeUrl as string) || null);
        const analysis = (r.analysis as unknown) as ResumeAnalysis | undefined;
        const mapped: ResumeEvaluation = {
          score: analysis?.score ?? 0,
          matchPercentage: (analysis?.matchPercentage as number) ?? 0,
          grammarIssues: (analysis?.grammarIssues as string[]) ?? [],
          missingSections: (analysis?.missingSections as string[]) ?? [],
          extractedText: (analysis?.extractedText as string) ?? '',
          keywordMatches: {
            matched: (analysis?.keywords as string[]) ?? [],
            missing: []
          },
          strengths: (analysis?.strengths as string[]) ?? [],
          recommendations: (analysis?.suggestions as string[]) ?? []
        };
        setEvaluation(mapped);
      } catch (error) {
        console.error('Upload/Evaluation failed:', error);
      } finally {
        setIsEvaluating(false);
      }
    }
  }, [user, uploadResume]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const userApplications: Application[] = (myApplications as Application[]) || [];
  const hasApplied = userApplications.some((app) => String((app as unknown as { job?: { _id?: string } }).job?._id || app.jobId) === String(id));

  if (!job) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Job Not Found
        </h1>
        <Link to="/jobs">
          <Button>Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  const handleReUpload = () => {
    setUploadedFile(null);
    setEvaluation(null);
    setCurrentStep('upload');
  };

  const handleSubmitApplication = async () => {
    if (!user || !uploadedFile || !evaluation || !resumeUrl) return;

    setIsSubmitting(true);
    try {
      // Call backend apply with resumeUrl and analysis
  await applyToJob.mutateAsync({ userId: user.id, jobId: job.id, resumeUrl, analysis: evaluation as unknown as Record<string, unknown> });

      // Keep local store for immediate UX
      addApplication({
        userId: user.id,
        jobId: job.id,
        status: 'applied',
        submittedAt: new Date().toISOString(),
        timeline: [{ status: 'applied', date: new Date().toISOString(), note: 'Application submitted with resume analysis' }],
        resumeId: Date.now().toString(),
        resumeFilename: uploadedFile.name,
        resumeScore: evaluation?.score || 0,
        matchPercentage: evaluation?.matchPercentage || 0
      });

      navigate('/applications');
    } catch (err) {
      console.error('Submit application failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSalary = () => {
    if (!job.salary) return 'Salary not specified';
    
    if (job.type === 'internship') {
      return `$${job.salary.min}-${job.salary.max}/hour`;
    }
    
    return `$${(job.salary.min / 1000).toFixed(0)}k-${(job.salary.max / 1000).toFixed(0)}k`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMatchColor = (match: number) => {
    if (match >= 70) return 'text-green-600 dark:text-green-400';
    if (match >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const steps = [
    { id: 'view', label: 'Job Details', icon: Eye },
    { id: 'upload', label: 'Upload Resume', icon: Upload },
    { id: 'evaluate', label: 'AI Analysis', icon: FileText },
    { id: 'submit', label: 'Submit Application', icon: Send }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/jobs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Building className="w-4 h-4" />
          <span>{job.company}</span>
        </div>
      </div>

      {/* Progress Steps */}
      {!hasApplied && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                      ? 'bg-indigo-500 border-indigo-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {job.title}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 mb-4">
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
                    <span>{new Date(job.postedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="success">{job.type}</Badge>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatSalary()}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{job.applicantCount} applicants</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                {job.description}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Requirements
            </h2>
            <ul className="space-y-2">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Application Panel */}
        <div className="space-y-6">
          {hasApplied ? (
            <Card className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Application Submitted
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You have already applied to this position. Check your applications page for updates.
              </p>
              <Link to="/applications">
                <Button className="w-full">
                  View Applications
                </Button>
              </Link>
            </Card>
          ) : (
            <>
              {/* Upload Resume */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Apply for this Position
                </h3>
                
                {!uploadedFile ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                      isDragActive
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Drag and drop or click to browse
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {uploadedFile.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReUpload}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleReUpload}
                    >
                      Upload Different Resume
                    </Button>
                  </div>
                )}
              </Card>

              {/* Evaluation Results */}
              <AnimatePresence>
                {isEvaluating && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card className="p-6 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Analyzing Your Resume
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Our AI is evaluating your resume against this job...
                      </p>
                    </Card>
                  </motion.div>
                )}

                {evaluation && !isEvaluating && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Score Overview */}
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Resume Analysis Results
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className={`text-2xl font-bold ${getScoreColor(evaluation.score)}`}>
                            {evaluation.score}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            ATS Score
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className={`text-2xl font-bold ${getMatchColor(evaluation.matchPercentage)}`}>
                            {evaluation.matchPercentage}%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Job Match
                          </div>
                        </div>
                      </div>

                      {/* Keyword Matches */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Skill Matches ({evaluation.keywordMatches.matched.length}/{job.skills.length})
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {evaluation.keywordMatches.matched.map((skill: string) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs rounded-md"
                            >
                              ✓ {skill}
                            </span>
                          ))}
                          {evaluation.keywordMatches.missing.slice(0, 3).map((skill: string) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs rounded-md"
                            >
                              ✗ {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Issues */}
                      {(evaluation.grammarIssues.length > 0 || evaluation.missingSections.length > 0) && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Areas for Improvement
                          </h4>
                          <div className="space-y-2">
                            {evaluation.grammarIssues.slice(0, 2).map((issue: string, index: number) => (
                              <div key={index} className="flex items-start space-x-2">
                                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">{issue}</span>
                              </div>
                            ))}
                            {evaluation.missingSections.map((section: string, index: number) => (
                              <div key={index} className="flex items-start space-x-2">
                                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Consider adding {section} section
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={handleReUpload}
                        >
                          Re-upload Resume
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={handleSubmitApplication}
                          loading={isSubmitting}
                        >
                          Submit Application
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
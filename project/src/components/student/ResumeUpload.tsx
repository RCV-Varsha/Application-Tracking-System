import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle, Download, GitCompare as Compare, Table as Tabs } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useUploadResume, useResumes } from '../../hooks/useApi';
import { Badge } from '../ui/Badge';
import { saveAs } from 'file-saver';

interface JobComparisonResult {
  presentKeywords: string[];
  missingKeywords: string[];
  skillsMatch: number;
  jobSpecificSuggestions: string[];
}

export const ResumeUpload: React.FC = () => {
  const { user } = useAuthStore();
  const { data: resumes, isLoading } = useResumes(user?.id || '');
  const uploadMutation = useUploadResume();
  const [jobDescription, setJobDescription] = React.useState('');
  const [comparisonResult, setComparisonResult] = React.useState<JobComparisonResult | null>(null);
  const [isComparing, setIsComparing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'general' | 'comparison'>('general');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && user?.id) {
      uploadMutation.mutate({ userId: user.id, file });
    }
  }, [user?.id, uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const currentResume = resumes?.[0];

  const handleCompareWithJob = async () => {
    if (!currentResume || !jobDescription.trim()) return;
    
    setIsComparing(true);
    
    // Simulate AI comparison processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock comparison logic
    const jobKeywords = extractKeywords(jobDescription);
    const resumeKeywords = currentResume.keywords.map(k => k.toLowerCase());
    
    const presentKeywords = jobKeywords.filter(keyword => 
      resumeKeywords.some(resumeKeyword => 
        resumeKeyword.includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(resumeKeyword)
      )
    );
    
    const missingKeywords = jobKeywords.filter(keyword => 
      !resumeKeywords.some(resumeKeyword => 
        resumeKeyword.includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(resumeKeyword)
      )
    );
    
    const skillsMatch = Math.round((presentKeywords.length / jobKeywords.length) * 100);
    
    const jobSpecificSuggestions = [
      `Add ${missingKeywords.slice(0, 3).join(', ')} to your skills section`,
      'Quantify your achievements with specific metrics mentioned in the job description',
      'Include relevant project examples that demonstrate required competencies',
      'Tailor your professional summary to match the job requirements'
    ];
    
    setComparisonResult({
      presentKeywords,
      missingKeywords,
      skillsMatch,
      jobSpecificSuggestions
    });
    
    setIsComparing(false);
    setActiveTab('comparison');
  };

  const extractKeywords = (text: string): string[] => {
    // Simple keyword extraction - in real app this would be more sophisticated
    const commonSkills = [
      'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'CSS', 'HTML',
      'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Git',
      'Machine Learning', 'Data Analysis', 'Project Management', 'Agile', 'Scrum'
    ];
    
    return commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    ).slice(0, 10);
  };

  const downloadReport = () => {
    if (!currentResume) return;
    
    const reportContent = `
AI RESUME ANALYSIS REPORT
========================

GENERAL ANALYSIS:
Resume Score: ${currentResume.score}/100
Grammar Score: ${currentResume.analysis.grammarScore}/100
ATS Optimization: ${currentResume.analysis.atsOptimization}/100
Completeness: ${currentResume.analysis.completeness}/100

IMPROVEMENT SUGGESTIONS:
${currentResume.analysis.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

${comparisonResult ? `
JOB DESCRIPTION COMPARISON:
Skills Match: ${comparisonResult.skillsMatch}%

PRESENT KEYWORDS:
${comparisonResult.presentKeywords.map(k => `✅ ${k}`).join('\n')}

MISSING KEYWORDS:
${comparisonResult.missingKeywords.map(k => `❌ ${k}`).join('\n')}

JOB-SPECIFIC SUGGESTIONS:
${comparisonResult.jobSpecificSuggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}
` : ''}

Generated on: ${new Date().toLocaleDateString()}
    `.trim();
    
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `resume-analysis-report-${new Date().toISOString().split('T')[0]}.txt`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Resume
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Upload and analyze your resume with AI-powered insights
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Upload Resume
            </h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop your file or click to browse
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supports PDF, DOC, DOCX (Max 5MB)
              </p>
              
              {uploadMutation.isLoading && (
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">
                    Analyzing your resume...
                  </p>
                </div>
              )}
            </div>

            {uploadMutation.isError && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-800 dark:text-red-200">
                    Upload failed. Please try again.
                  </span>
                </div>
              </div>
            )}

            {uploadMutation.isSuccess && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-800 dark:text-green-200">
                    Resume uploaded and analyzed successfully!
                  </span>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Current Resume */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Current Resume
            </h2>
            
            {currentResume ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {currentResume.filename}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Uploaded {new Date(currentResume.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {currentResume.score}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ATS Score
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentResume.analysis.grammarScore}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Grammar
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentResume.analysis.atsOptimization}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ATS Optimization
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Resume Sections
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(currentResume.sections).map(([section, completed]) => (
                      <div key={section} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {section}
                        </span>
                        {completed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" variant="primary">
                    View Detailed Analysis
                  </Button>
                  <Button className="w-full" variant="outline">
                    Download Resume
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Resume Uploaded
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload your resume to get started with AI-powered analysis
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Job Description Input */}
      {currentResume && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Job Description Analysis
              </h2>
              <Button
                onClick={downloadReport}
                variant="outline"
                size="sm"
                disabled={!currentResume}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Paste Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description you're targeting here..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                />
              </div>
              
              <Button
                onClick={handleCompareWithJob}
                disabled={!jobDescription.trim() || isComparing}
                loading={isComparing}
                className="w-full"
              >
                <Compare className="w-4 h-4 mr-2" />
                {isComparing ? 'Analyzing...' : 'Compare with Resume'}
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
      {/* Analysis Results */}
      {currentResume && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                AI Analysis Results
              </h2>
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'general'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  General Analysis
                </button>
                <button
                  onClick={() => setActiveTab('comparison')}
                  disabled={!comparisonResult}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'comparison' && comparisonResult
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  Job Comparison
                  {comparisonResult && (
                    <Badge variant="success" className="ml-2 text-xs">
                      {comparisonResult.skillsMatch}%
                    </Badge>
                  )}
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Improvement Suggestions
                  </h3>
                  <div className="space-y-3">
                    {currentResume.analysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Keywords Found
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentResume.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'comparison' && comparisonResult && (
              <div className="space-y-6">
                {/* Skills Match Overview */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Job Match Analysis
                    </h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {comparisonResult.skillsMatch}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Skills Match
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Present Keywords */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Present in Resume ({comparisonResult.presentKeywords.length})
                    </h4>
                    <div className="space-y-2">
                      {comparisonResult.presentKeywords.map((keyword, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-green-600 dark:text-green-400">✅</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{keyword}</span>
                        </div>
                      ))}
                    </div>
                  {/* Missing Keywords */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      Missing from Resume ({comparisonResult.missingKeywords.length})
                    </h4>
                    <div className="space-y-2">
                      {comparisonResult.missingKeywords.map((keyword, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-red-600 dark:text-red-400">❌</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{keyword}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                  </div>
                {/* Job-Specific Suggestions */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                    Job-Specific Recommendations
                  </h4>
                  <div className="space-y-3">
                    {comparisonResult.jobSpecificSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          {suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
};
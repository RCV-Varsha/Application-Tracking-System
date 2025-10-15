import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Award,
  Briefcase,
  FileText,
  Plus,
  Edit,
  Upload,
  Download,
  Eye,
  Globe,
  Shield,
  TrendingUp,
  Target,
  BookOpen,
  Users
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import studentProfileData from '../../data/studentProfile.json';

interface StudentProfile {
  id: string;
  profileHeader: {
    avatar: string;
    name: string;
    role: string;
    email: string;
    phone: string;
  };
  personalInfo: {
    fullName: string;
    gender: string;
    dob: string;
    address: string;
  };
  academicInfo: {
    university: string;
    branch: string;
    year: string;
    gpa: string;
    certifications: string[];
  };
  careerPreferences: {
    preferredRoles: string[];
    jobType: string;
    locations: string[];
  };
  resumeAndSkills: {
    resumeUrl: string;
    resumeName: string;
    lastUpdated: string;
    skills: string[];
  };
  activitySummary: {
    applicationsSubmitted: number;
    resumesAnalyzed: number;
    jobsSaved: number;
    feedbackReceived: number;
  };
  privacyControls: {
    showProfileToRecruiters: boolean;
    emailJobSuggestions: boolean;
  };
}

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange, disabled = false }) => (
  <button
    onClick={() => !disabled && onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
      enabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    disabled={disabled}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile>(studentProfileData);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updatePrivacySetting = (key: keyof typeof profile.privacyControls, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      privacyControls: {
        ...prev.privacyControls,
        [key]: value
      }
    }));
    showToast('Privacy setting updated', 'success');
  };

  const handleDownloadResume = () => {
    showToast('Resume download started', 'success');
  };

  const handleViewResume = () => {
    showToast('Opening resume viewer', 'success');
  };

  const handleUploadResume = () => {
    showToast('Resume upload feature coming soon', 'success');
  };

  const handleEditProfile = () => {
    showToast('Edit profile feature coming soon', 'success');
  };

  const handleAddSkill = () => {
    showToast('Add skill feature coming soon', 'success');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getJobTypeColor = (jobType: string) => {
    switch (jobType.toLowerCase()) {
      case 'full-time': return 'success';
      case 'part-time': return 'warning';
      case 'internship': return 'info';
      default: return 'default';
    }
  };

  const activityStats = [
    {
      icon: Briefcase,
      label: 'Applications',
      value: profile.activitySummary.applicationsSubmitted,
      color: 'bg-blue-500'
    },
    {
      icon: FileText,
      label: 'Resumes Analyzed',
      value: profile.activitySummary.resumesAnalyzed,
      color: 'bg-green-500'
    },
    {
      icon: BookOpen,
      label: 'Jobs Saved',
      value: profile.activitySummary.jobsSaved,
      color: 'bg-purple-500'
    },
    {
      icon: Users,
      label: 'Feedback Received',
      value: profile.activitySummary.feedbackReceived,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your profile information and career preferences
        </p>
      </div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={profile.profileHeader.avatar}
                alt={profile.profileHeader.name}
                className="w-32 h-32 rounded-full ring-4 ring-indigo-100 dark:ring-indigo-900/50"
              />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-900"></div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {profile.profileHeader.name}
              </h2>
              <Badge variant="info" className="mb-4">
                {profile.profileHeader.role}
              </Badge>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{profile.profileHeader.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>{profile.profileHeader.phone}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleEditProfile}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" onClick={handleUploadResume}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resume
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Personal Information
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your basic personal details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <p className="text-gray-900 dark:text-white">{profile.personalInfo.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  <p className="text-gray-900 dark:text-white">{profile.personalInfo.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900 dark:text-white">{formatDate(profile.personalInfo.dob)}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <p className="text-gray-900 dark:text-white">{profile.personalInfo.address}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Academic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Academic Information
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your educational background and achievements
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    University/College
                  </label>
                  <p className="text-gray-900 dark:text-white">{profile.academicInfo.university}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Branch
                  </label>
                  <p className="text-gray-900 dark:text-white">{profile.academicInfo.branch}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year
                  </label>
                  <p className="text-gray-900 dark:text-white">{profile.academicInfo.year}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GPA
                  </label>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {profile.academicInfo.gpa}/10
                    </p>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Certifications & Achievements
                </label>
                <div className="flex flex-wrap gap-2">
                  {profile.academicInfo.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded-lg">
                      <Award className="w-4 h-4" />
                      <span className="text-sm font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Career Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Career Preferences
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your job preferences and career goals
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Preferred Roles
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profile.careerPreferences.preferredRoles.map((role, index) => (
                      <Badge key={index} variant="info" className="px-3 py-1">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Job Type
                    </label>
                    <Badge variant={getJobTypeColor(profile.careerPreferences.jobType)}>
                      {profile.careerPreferences.jobType}
                    </Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Preferred Locations
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {profile.careerPreferences.locations.map((location, index) => (
                        <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                          <Globe className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{location}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Resume & Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Resume & Skills
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your resume and technical skills
                  </p>
                </div>
              </div>

              {/* Resume Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Latest Resume
                </label>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {profile.resumeAndSkills.resumeName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last updated: {formatDate(profile.resumeAndSkills.lastUpdated)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleViewResume}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadResume}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Skills
                  </label>
                  <Button variant="outline" size="sm" onClick={handleAddSkill}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.resumeAndSkills.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Activity Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Activity Summary
              </h3>
              <div className="space-y-4">
                {activityStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Privacy & Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Privacy & Controls
                  </h3>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Show Profile to Recruiters
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Allow recruiters to view your profile and contact you directly for job opportunities.
                    </p>
                  </div>
                  <Toggle
                    enabled={profile.privacyControls.showProfileToRecruiters}
                    onChange={(enabled) => updatePrivacySetting('showProfileToRecruiters', enabled)}
                  />
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Email Job Suggestions
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Receive personalized job recommendations based on your profile and preferences.
                    </p>
                  </div>
                  <Toggle
                    enabled={profile.privacyControls.emailJobSuggestions}
                    onChange={(enabled) => updatePrivacySetting('emailJobSuggestions', enabled)}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
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
          <div className={`px-6 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {toast.message}
          </div>
        </motion.div>
      )}
    </div>
  );
};
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Mail,
  CheckCircle,
  Target,
  Settings,
  Bell,
  Clock,
  Filter,
  Trash2,
  X,
  Download,
  ChevronDown,
  AlertCircle,
  TrendingUp,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import notificationsData from '../../data/notifications.json';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions: Array<{
    label: string;
    url: string;
  }>;
}

interface ModalData {
  type: 'resume_report' | 'comparison' | 'feedback' | 'confirm';
  title: string;
  content: any;
}

const NOTIFICATION_TYPES = {
  resume_analysis: {
    icon: FileText,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/50',
    label: 'Resume Analysis'
  },
  resume_vs_jd: {
    icon: TrendingUp,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/50',
    label: 'Resume Comparison'
  },
  application_status: {
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/50',
    label: 'Application Update'
  },
  recruiter_feedback: {
    icon: MessageSquare,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/50',
    label: 'Recruiter Feedback'
  },
  interview_invite: {
    icon: Calendar,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/50',
    label: 'Interview Invite'
  },
  system: {
    icon: Settings,
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800',
    label: 'System Update'
  }
};

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'resume', label: 'Resume' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'application', label: 'Application' },
  { id: 'system', label: 'System' }
];

const DATE_FILTERS = [
  { id: 'all', label: 'All Time' },
  { id: '7days', label: 'Last 7 days' },
  { id: '30days', label: 'Last 30 days' }
];

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'unread', label: 'Unread First' }
];

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
  const [activeFilter, setActiveFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications.filter(notification => {
      // Type filter
      if (activeFilter === 'unread' && notification.read) return false;
      if (activeFilter === 'resume' && !['resume_analysis', 'resume_vs_jd'].includes(notification.type)) return false;
      if (activeFilter === 'feedback' && notification.type !== 'recruiter_feedback') return false;
      if (activeFilter === 'application' && notification.type !== 'application_status') return false;
      if (activeFilter === 'system' && notification.type !== 'system') return false;

      // Date filter
      if (dateFilter !== 'all') {
        const notifDate = new Date(notification.timestamp);
        const now = new Date();
        const daysAgo = dateFilter === '7days' ? 7 : 30;
        const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        if (notifDate < cutoffDate) return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'unread') {
        if (a.read !== b.read) return a.read ? 1 : -1;
      }
      
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      
      if (sortBy === 'oldest') return dateA - dateB;
      return dateB - dateA; // newest first (default)
    });

    return filtered;
  }, [notifications, activeFilter, dateFilter, sortBy]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    showToast('Notification deleted', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleActionClick = (notification: Notification, action: { label: string; url: string }) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Handle different action types with modals
    if (action.label === 'View Report') {
      setModalData({
        type: 'resume_report',
        title: 'Resume Analysis Report',
        content: {
          score: 85,
          grammar: 92,
          atsOptimization: 88,
          completeness: 95,
          suggestions: [
            'Add more quantifiable achievements',
            'Include relevant certifications',
            'Optimize keywords for ATS scanning',
            'Improve action verb usage'
          ]
        }
      });
      setShowModal(true);
    } else if (action.label === 'View Comparison') {
      setModalData({
        type: 'comparison',
        title: 'Resume vs Job Description Comparison',
        content: {
          matchPercentage: 67,
          presentSkills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Git'],
          missingSkills: ['Node.js', 'Python', 'AWS', 'Docker'],
          suggestions: [
            'Add Node.js experience to your backend skills',
            'Include Python projects in your portfolio',
            'Mention any cloud platform experience (AWS, Azure, GCP)',
            'Add containerization experience with Docker'
          ]
        }
      });
      setShowModal(true);
    } else if (action.label === 'View Feedback') {
      setModalData({
        type: 'feedback',
        title: 'Recruiter Feedback',
        content: {
          recruiter: 'Sarah Chen',
          company: 'TechCorp Inc.',
          feedback: 'Your resume shows strong technical skills, but we\'d like to see more specific examples of your project work. Please include metrics and outcomes for your previous projects. Also, consider adding any leadership or team collaboration experiences.',
          date: '2025-01-14T14:30:00Z'
        }
      });
      setShowModal(true);
    } else if (action.label === 'Accept') {
      setModalData({
        type: 'confirm',
        title: 'Accept Interview',
        content: {
          message: 'Are you sure you want to accept this interview invitation?',
          onConfirm: () => {
            setShowModal(false);
            showToast('Interview invitation accepted!', 'success');
          }
        }
      });
      setShowModal(true);
    } else if (action.label === 'Decline') {
      setModalData({
        type: 'confirm',
        title: 'Decline Interview',
        content: {
          message: 'Are you sure you want to decline this interview invitation?',
          onConfirm: () => {
            setShowModal(false);
            showToast('Interview invitation declined', 'success');
          }
        }
      });
      setShowModal(true);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const renderModal = () => {
    if (!modalData) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {modalData.title}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalData.type === 'resume_report' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {modalData.content.score}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Overall Score</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {modalData.content.grammar}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Grammar</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {modalData.content.atsOptimization}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">ATS Score</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {modalData.content.completeness}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Improvement Suggestions
                  </h3>
                  <div className="space-y-3">
                    {modalData.content.suggestions.map((suggestion: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}

            {modalData.type === 'comparison' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                      {modalData.content.matchPercentage}%
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Job Match Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Present Skills ({modalData.content.presentSkills.length})
                    </h3>
                    <div className="space-y-2">
                      {modalData.content.presentSkills.map((skill: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-green-600 dark:text-green-400">✅</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      Missing Skills ({modalData.content.missingSkills.length})
                    </h3>
                    <div className="space-y-2">
                      {modalData.content.missingSkills.map((skill: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-red-600 dark:text-red-400">❌</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    {modalData.content.suggestions.map((suggestion: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-sm text-amber-800 dark:text-amber-200">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" onClick={() => setShowModal(false)} className="w-full">
                  Close
                </Button>
              </div>
            )}

            {modalData.type === 'feedback' && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {modalData.content.recruiter}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {modalData.content.company}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getTimeAgo(modalData.content.date)}
                  </p>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {modalData.content.feedback}
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button className="flex-1">Reply to Recruiter</Button>
                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}

            {modalData.type === 'confirm' && (
              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300 text-center">
                  {modalData.content.message}
                </p>
                <div className="flex space-x-3">
                  <Button 
                    onClick={modalData.content.onConfirm}
                    className="flex-1"
                  >
                    Confirm
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Stay updated with your job search progress
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <Badge variant="info" className="px-3 py-1">
              {unreadCount} unread
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {FILTER_TABS.map(tab => {
              const count = tab.id === 'all' 
                ? notifications.length
                : tab.id === 'unread'
                ? unreadCount
                : notifications.filter(n => {
                    if (tab.id === 'resume') return ['resume_analysis', 'resume_vs_jd'].includes(n.type);
                    if (tab.id === 'feedback') return n.type === 'recruiter_feedback';
                    if (tab.id === 'application') return n.type === 'application_status';
                    if (tab.id === 'system') return n.type === 'system';
                    return false;
                  }).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeFilter === tab.id
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activeFilter === tab.id
                        ? 'bg-indigo-200 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200'
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dropdowns */}
          <div className="flex gap-3 lg:ml-auto">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              {DATE_FILTERS.map(filter => (
                <option key={filter.id} value={filter.id}>{filter.label}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => {
            const typeConfig = NOTIFICATION_TYPES[notification.type as keyof typeof NOTIFICATION_TYPES];
            const Icon = typeConfig?.icon || Bell;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  hover 
                  className={`p-6 transition-all duration-200 ${
                    !notification.read 
                      ? 'border-l-4 border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' 
                      : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${typeConfig?.bg}`}>
                      <Icon className={`w-6 h-6 ${typeConfig?.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${
                            !notification.read ? 'font-bold' : ''
                          }`}>
                            {notification.title}
                          </h3>
                          <p className={`text-gray-600 dark:text-gray-400 mt-1 ${
                            !notification.read ? 'font-medium' : ''
                          }`}>
                            {notification.message}
                          </p>
                        </div>
                        
                        {/* Unread indicator & Delete */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <div className="w-3 h-3 bg-indigo-500 rounded-full flex-shrink-0"></div>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Timestamp and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{getTimeAgo(notification.timestamp)}</span>
                          </div>
                          <Badge variant="default" size="sm">
                            {typeConfig?.label}
                          </Badge>
                        </div>

                        {/* Action Buttons */}
                        {notification.actions.length > 0 && (
                          <div className="flex items-center space-x-2">
                            {notification.actions.map((action, actionIndex) => (
                              <Button
                                key={actionIndex}
                                size="sm"
                                variant={actionIndex === 0 ? 'primary' : 'outline'}
                                onClick={() => handleActionClick(notification, action)}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <Card className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No notifications found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {notifications.length === 0 
                ? "You don't have any notifications yet. Upload a resume or apply to jobs to get started!"
                : "No notifications match your current filters."
              }
            </p>
            {notifications.length === 0 && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/resume">
                  <Button>Upload Resume</Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline">Browse Jobs</Button>
                </Link>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && renderModal()}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
};
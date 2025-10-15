import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Bell,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Settings,
  Clock,
  Filter,
  CheckCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  getRecruiterNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../../services/mockRecruiterService';
import { RecruiterNotification } from '../../mock/notifications';
import { Link } from 'react-router-dom';

type FilterType = 'all' | 'unread' | 'application' | 'reminder' | 'system';

const NOTIFICATION_ICONS = {
  application: Briefcase,
  status: CheckCircle,
  reminder: AlertCircle,
  system: Settings
};

const NOTIFICATION_COLORS = {
  application: {
    icon: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/50',
    badge: 'info'
  },
  status: {
    icon: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/50',
    badge: 'success'
  },
  reminder: {
    icon: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/50',
    badge: 'warning'
  },
  system: {
    icon: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800',
    badge: 'default'
  }
};

export const RecruiterNotifications: React.FC = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterType>('all');

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['recruiter', 'notifications'],
    queryFn: getRecruiterNotifications
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'notifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter', 'notifications'] });
    }
  });

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredNotifications = notifications.filter((notification: RecruiterNotification) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter((n: RecruiterNotification) => !n.read).length;

  const handleMarkAsRead = (notificationId: number) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const filters: { key: FilterType; label: string; icon?: any }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'application', label: 'Applications', icon: Briefcase },
    { key: 'reminder', label: 'Reminders', icon: AlertCircle },
    { key: 'system', label: 'System', icon: Settings }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Stay updated with your recruitment activities
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <Badge variant="info" size="lg">
              {unreadCount} unread
            </Badge>
          )}
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {filters.map((f) => {
          const FilterIcon = f.icon;
          const isActive = filter === f.key;
          const count = f.key === 'unread'
            ? unreadCount
            : f.key === 'all'
              ? notifications.length
              : notifications.filter((n: RecruiterNotification) => n.type === f.key).length;

          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {FilterIcon && <FilterIcon className="w-4 h-4" />}
              <span>{f.label}</span>
              {count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification: RecruiterNotification) => {
            const Icon = NOTIFICATION_ICONS[notification.type];
            const colors = NOTIFICATION_COLORS[notification.type];

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`p-5 transition-all hover:shadow-md ${
                    !notification.read
                      ? 'border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-900/10'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                      <Icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className={`text-base font-semibold text-gray-900 dark:text-white ${
                              !notification.read ? 'font-bold' : ''
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <Badge
                            variant={colors.badge as any}
                            size="sm"
                            className="mt-1"
                          >
                            {notification.type}
                          </Badge>
                        </div>

                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title={notification.read ? 'Mark as unread' : 'Mark as read'}
                        >
                          {notification.read ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{getTimeAgo(notification.time)}</span>
                        </div>

                        {notification.actionUrl && (
                          <Link
                            to={notification.actionUrl}
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                          >
                            View details →
                          </Link>
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
            <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No notifications found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all'
                ? "You're all caught up!"
                : `No ${filter} notifications at the moment`}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

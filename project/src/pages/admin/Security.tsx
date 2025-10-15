import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Monitor,
  Key,
  Lock,
  MapPin,
  Clock,
  User,
  LogOut,
  Ban,
  Settings,
  Globe,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  getAdminSecurity,
  terminateSession,
  blockIP,
  unblockIP,
  updatePasswordPolicy,
  update2FASettings,
} from '../../services/mockAdminService';

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, subtitle }) => (
  <Card hover>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {title}
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {value.toLocaleString()}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  </Card>
);

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Success':
      return <Badge variant="success">Success</Badge>;
    case 'Failed':
      return <Badge variant="warning">Failed</Badge>;
    case 'Blocked':
      return <Badge variant="error">Blocked</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getIPStatusBadge = (status: string) => {
  switch (status) {
    case 'Blocked':
      return <Badge variant="error">Blocked</Badge>;
    case 'Flagged':
      return <Badge variant="warning">Flagged</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const AdminSecurity: React.FC = () => {
  const queryClient = useQueryClient();
  const [showPasswordPolicy, setShowPasswordPolicy] = useState(false);
  const [show2FASettings, setShow2FASettings] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'security'],
    queryFn: getAdminSecurity,
  });

  const terminateSessionMutation = useMutation({
    mutationFn: terminateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'security'] });
    },
  });

  const blockIPMutation = useMutation({
    mutationFn: blockIP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'security'] });
    },
  });

  const unblockIPMutation = useMutation({
    mutationFn: unblockIP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'security'] });
    },
  });

  const handleTerminateSession = (sessionId: number) => {
    if (confirm('Are you sure you want to terminate this session?')) {
      terminateSessionMutation.mutate(sessionId);
    }
  };

  const handleBlockIP = (ip: string) => {
    if (confirm(`Are you sure you want to block IP: ${ip}?`)) {
      blockIPMutation.mutate(ip);
    }
  };

  const handleUnblockIP = (ip: string) => {
    if (confirm(`Are you sure you want to unblock IP: ${ip}?`)) {
      unblockIPMutation.mutate(ip);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Security Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor access, manage permissions, and secure your platform
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MetricCard
            title="Total Logins"
            value={data.summary.totalLogins}
            icon={<CheckCircle className="w-6 h-6 text-white" />}
            color="bg-green-600"
            subtitle="Last 30 days"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <MetricCard
            title="Failed Attempts"
            value={data.summary.failedAttempts}
            icon={<XCircle className="w-6 h-6 text-white" />}
            color="bg-orange-600"
            subtitle="Requires monitoring"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MetricCard
            title="Active Sessions"
            value={data.summary.activeSessions}
            icon={<Monitor className="w-6 h-6 text-white" />}
            color="bg-blue-600"
            subtitle="Currently online"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <MetricCard
            title="Blocked IPs"
            value={data.summary.blockedIPs}
            icon={<Ban className="w-6 h-6 text-white" />}
            color="bg-red-600"
            subtitle="Security threats"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Login Activity
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Latest authentication attempts
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3">
                      User
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3">
                      Location
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.loginActivity.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.user}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.role}
                          </p>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="w-3 h-3" />
                          {activity.location}
                        </div>
                      </td>
                      <td className="py-3">{getStatusBadge(activity.status)}</td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                        {activity.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Active Sessions
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Currently logged in users
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {data.activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.user}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <Monitor className="w-3 h-3" />
                        <span>{session.device} - {session.browser}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <Globe className="w-3 h-3" />
                        <span>{session.ip}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>Last active: {session.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTerminateSession(session.id)}
                    disabled={terminateSessionMutation.isPending}
                  >
                    <LogOut className="w-3 h-3 mr-1" />
                    End
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Suspicious IP Addresses
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Flagged or blocked IP addresses
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {data.suspiciousIPs.map((ipData, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                        {ipData.ip}
                      </p>
                      {getIPStatusBadge(ipData.status)}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {ipData.reason}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {ipData.attempts} failed attempts
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {ipData.status === 'Blocked' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnblockIP(ipData.ip)}
                        disabled={unblockIPMutation.isPending}
                      >
                        Unblock
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBlockIP(ipData.ip)}
                        disabled={blockIPMutation.isPending}
                      >
                        <Ban className="w-3 h-3 mr-1" />
                        Block
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Roles & Permissions
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Access control by user role
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {data.rolesAndPermissions.map((roleData, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {roleData.role}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {roleData.permissions.map((permission, pIndex) => (
                      <span
                        key={pIndex}
                        className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Password Policy
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Current password requirements
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordPolicy(!showPasswordPolicy)}
              >
                <Settings className="w-4 h-4 mr-2" />
                {showPasswordPolicy ? 'Cancel' : 'Edit'}
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Key className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Minimum Length
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {data.passwordPolicy.minLength} characters
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  {data.passwordPolicy.requiresUppercase ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Requires Uppercase
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {data.passwordPolicy.requiresUppercase ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  {data.passwordPolicy.requiresNumber ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Requires Number
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {data.passwordPolicy.requiresNumber ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  {data.passwordPolicy.requiresSymbol ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Requires Symbol
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {data.passwordPolicy.requiresSymbol ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last updated: {data.passwordPolicy.lastUpdated}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Two-Factor Authentication
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Enhanced security settings
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShow2FASettings(!show2FASettings)}
              >
                <Settings className="w-4 h-4 mr-2" />
                {show2FASettings ? 'Cancel' : 'Edit'}
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      2FA Status
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Two-factor authentication
                    </p>
                  </div>
                </div>
                <Badge variant={data.twoFA.enabled ? 'success' : 'error'}>
                  {data.twoFA.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Authentication Method
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Current verification method
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {data.twoFA.method}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Enforcement
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Require 2FA for all users
                    </p>
                  </div>
                </div>
                <Badge variant={data.twoFA.enforced ? 'success' : 'warning'}>
                  {data.twoFA.enforced ? 'Enforced' : 'Optional'}
                </Badge>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

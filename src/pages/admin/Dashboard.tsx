import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  CheckCircle,
  AlertCircle,
  FileText,
  TrendingUp,
  UserCheck,
  Download,
  Clock
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import axiosInstance from '../../api/axiosInstance';

const fetchAdminOverview = async () => {
  const resp = await axiosInstance.get('/admin/overview');
  return resp.data;
};

const KPICard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}> = ({ title, value, icon, trend, color }) => (
  <Card hover>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {title}
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value.toLocaleString()}
        </p>
        {trend && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  </Card>
);

const ActivityItem: React.FC<{
  type: string;
  text: string;
  time: string;
}> = ({ type, text, time }) => {
  const getIcon = () => {
    switch (type) {
      case 'signup':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'recruiter_approved':
        return <UserCheck className="w-5 h-5 text-green-600" />;
      case 'job_post':
        return <Briefcase className="w-5 h-5 text-purple-600" />;
      case 'report':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'application':
        return <FileText className="w-5 h-5 text-indigo-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="mt-1">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-white">
          {text}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {time}
        </p>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: fetchAdminOverview,
  });

  const handleApproveRecruiters = () => {
    console.log('Navigate to recruiter approvals');
  };

  const handleViewReports = () => {
    console.log('Navigate to reports');
  };

  const handleExportUsers = () => {
    console.log('Export users CSV');
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
            Admin Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage users, recruiters, and system-wide activities
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleApproveRecruiters}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Approve Recruiters
            {data.kpis.pendingRecruiters > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full text-xs font-medium">
                {data.kpis.pendingRecruiters}
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewReports}
          >
            <FileText className="w-4 h-4 mr-2" />
            View Reports
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportUsers}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <KPICard
            title="Total Users"
            value={data.kpis.totalUsers}
            icon={<Users className="w-6 h-6 text-white" />}
            trend="+12% from last month"
            color="bg-blue-600"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <KPICard
            title="Active Recruiters"
            value={data.kpis.activeRecruiters}
            icon={<UserCheck className="w-6 h-6 text-white" />}
            trend="+8% from last month"
            color="bg-green-600"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <KPICard
            title="Pending Approvals"
            value={data.kpis.pendingRecruiters}
            icon={<AlertCircle className="w-6 h-6 text-white" />}
            trend="Requires attention"
            color="bg-orange-600"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <KPICard
            title="Total Job Posts"
            value={data.kpis.totalJobs}
            icon={<Briefcase className="w-6 h-6 text-white" />}
            trend="+15% from last month"
            color="bg-purple-600"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <KPICard
            title="Active Applications"
            value={data.kpis.activeApplications}
            icon={<FileText className="w-6 h-6 text-white" />}
            trend="+22% from last month"
            color="bg-indigo-600"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <KPICard
            title="Reports Today"
            value={data.kpis.reportsToday}
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            trend="Needs review"
            color="bg-red-600"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Growth (Last 7 Days)
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                New user registrations per day
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.usersGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="day"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Applications Over Time (Last 7 Days)
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Job applications submitted per day
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.applicationsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="day"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#6366f1"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Latest system-wide actions and events
            </p>
          </div>
          <div className="space-y-0">
            {data.recentActivity.map((activity) => (
              <ActivityItem
                key={activity.id}
                type={activity.type}
                text={activity.text}
                time={activity.time}
              />
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

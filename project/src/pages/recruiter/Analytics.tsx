import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Target,
  Award,
  Download,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { saveAs } from 'file-saver';
import { getAnalytics } from '../../services/mockRecruiterService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

type DateRange = '7' | '30' | 'custom';

export const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>('7');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showCustomRange, setShowCustomRange] = useState(false);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['recruiter', 'analytics', dateRange, customStart, customEnd],
    queryFn: () => getAnalytics(dateRange, customStart, customEnd),
    staleTime: 5 * 60 * 1000
  });

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    if (range !== 'custom') {
      setShowCustomRange(false);
      setCustomStart('');
      setCustomEnd('');
    } else {
      setShowCustomRange(true);
    }
  };

  const exportChartData = (data: any[], filename: string) => {
    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const dateRangeLabel = useMemo(() => {
    if (dateRange === '7') return 'Last 7 Days';
    if (dateRange === '30') return 'Last 30 Days';
    if (customStart && customEnd) {
      return `${new Date(customStart).toLocaleDateString()} - ${new Date(customEnd).toLocaleDateString()}`;
    }
    return 'Custom Range';
  }, [dateRange, customStart, customEnd]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24" />
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20" />
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <div className="animate-pulse h-80 bg-gray-300 dark:bg-gray-700 rounded" />
        </Card>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your recruitment performance and insights
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => handleDateRangeChange('7')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                dateRange === '7'
                  ? 'bg-white dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => handleDateRangeChange('30')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                dateRange === '30'
                  ? 'bg-white dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => handleDateRangeChange('custom')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                dateRange === 'custom'
                  ? 'bg-white dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showCustomRange && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Total Applicants
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.kpis.totalApplicants}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              {dateRangeLabel}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Conversion Rate
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.kpis.conversionRate}%
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Shortlist to hire ratio
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Average Score
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.kpis.avgScore}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Resume quality metric
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Active Jobs
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics.kpis.totalJobs}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Currently open positions
            </p>
          </Card>
        </motion.div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <LineChartIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Applications Over Time
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportChartData(analytics.applicantsByDay, 'applicants-by-day')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.applicantsByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              stroke="#6B7280"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '12px',
                color: '#fff'
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="applicants"
              stroke="#06B6D4"
              strokeWidth={3}
              dot={{ fill: '#06B6D4', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <PieChartIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Status Breakdown
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportChartData(analytics.statusBreakdown, 'status-breakdown')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.statusBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.statusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Top Skills in Demand
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportChartData(analytics.topSkills, 'top-skills')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topSkills} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis dataKey="skill" type="category" stroke="#6B7280" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="count" fill="#06B6D4" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Common Resume Issues
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportChartData(analytics.resumeMistakes, 'resume-mistakes')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.resumeMistakes}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="mistake"
              stroke="#6B7280"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
            />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Bar dataKey="count" fill="#F59E0B" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Application } from '../../types';

interface ApplicationsChartProps {
  applications: Application[];
}

export const ApplicationsChart: React.FC<ApplicationsChartProps> = ({ applications }) => {
  // Generate mock data for the last 7 days
  const chartData = React.useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        applications: Math.floor(Math.random() * 5) + 1
      };
    });
    return days;
  }, [applications]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          className="text-sm text-gray-600 dark:text-gray-400"
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          className="text-sm text-gray-600 dark:text-gray-400"
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'var(--tooltip-bg)',
            border: '1px solid var(--tooltip-border)',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="applications" 
          stroke="#4F46E5" 
          strokeWidth={2}
          dot={{ fill: '#4F46E5', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#4F46E5', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
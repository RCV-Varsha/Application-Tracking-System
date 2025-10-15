export interface AnalyticsData {
  kpis: {
    totalApplicants: number;
    conversionRate: number;
    avgScore: number;
    totalJobs: number;
  };
  applicantsByDay: Array<{
    date: string;
    applicants: number;
  }>;
  statusBreakdown: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  topSkills: Array<{
    skill: string;
    count: number;
  }>;
  resumeMistakes: Array<{
    mistake: string;
    count: number;
  }>;
}

export const generateAnalyticsData = (days: number): AnalyticsData => {
  const applicantsByDay = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    applicantsByDay.push({
      date: date.toISOString().split('T')[0],
      applicants: Math.floor(Math.random() * 15) + 5
    });
  }

  const totalApplicants = applicantsByDay.reduce((sum, day) => sum + day.applicants, 0);

  return {
    kpis: {
      totalApplicants,
      conversionRate: Math.floor(Math.random() * 20) + 15,
      avgScore: Math.floor(Math.random() * 15) + 75,
      totalJobs: 12
    },
    applicantsByDay,
    statusBreakdown: [
      { name: 'Under Review', value: Math.floor(totalApplicants * 0.45), color: '#6B7280' },
      { name: 'Shortlisted', value: Math.floor(totalApplicants * 0.30), color: '#10B981' },
      { name: 'Rejected', value: Math.floor(totalApplicants * 0.20), color: '#EF4444' },
      { name: 'Request Update', value: Math.floor(totalApplicants * 0.05), color: '#F59E0B' }
    ],
    topSkills: [
      { skill: 'React', count: 45 },
      { skill: 'TypeScript', count: 38 },
      { skill: 'Node.js', count: 35 },
      { skill: 'Python', count: 32 },
      { skill: 'JavaScript', count: 30 },
      { skill: 'SQL', count: 28 },
      { skill: 'MongoDB', count: 25 },
      { skill: 'Docker', count: 22 },
      { skill: 'AWS', count: 20 },
      { skill: 'GraphQL', count: 18 }
    ],
    resumeMistakes: [
      { mistake: 'Missing summary section', count: 28 },
      { mistake: 'Inconsistent formatting', count: 24 },
      { mistake: 'Spelling errors', count: 20 },
      { mistake: 'Unclear project descriptions', count: 18 },
      { mistake: 'Missing contact details', count: 15 },
      { mistake: 'Tense inconsistency', count: 12 },
      { mistake: 'Excessive length', count: 10 },
      { mistake: 'Poor layout', count: 8 }
    ]
  };
};

export const mockAnalytics7Days = generateAnalyticsData(7);
export const mockAnalytics30Days = generateAnalyticsData(30);

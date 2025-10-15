export interface AdminJobFlag {
  id: number;
  reason: string;
  reportedAt: string;
  reportedBy?: string;
}

export interface AdminJobRecruiter {
  id: number;
  name: string;
  email: string;
  company?: string;
}

export interface AdminJob {
  id: number;
  title: string;
  company: string;
  recruiter: AdminJobRecruiter;
  postedAt: string;
  status: 'Pending' | 'Published' | 'Removed' | 'Flagged';
  applicants: number;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Intern' | 'Contract';
  experience: string;
  salary: string;
  excerpt: string;
  description?: string;
  requirements?: string[];
  flags: AdminJobFlag[];
}

export const mockAdminJobs: AdminJob[] = [
  {
    id: 101,
    title: "Frontend Intern - React",
    company: "AceTech Solutions",
    recruiter: { id: 501, name: "Sarah Chen", email: "sarah@acetech.com", company: "AceTech Solutions" },
    postedAt: "2025-09-12",
    status: "Pending",
    applicants: 12,
    location: "Hyderabad, India",
    type: "Intern",
    experience: "0-1 yrs",
    salary: "₹10,000 - ₹15,000",
    excerpt: "Build modern frontend UI with React and Tailwind.",
    description: "We are looking for a passionate frontend intern to join our team and work on exciting React projects.",
    requirements: ["React", "TypeScript", "Tailwind CSS", "Git"],
    flags: [{ id: 1, reason: "Inaccurate salary information", reportedAt: "2025-09-14", reportedBy: "User #2342" }]
  },
  {
    id: 102,
    title: "Data Analyst Intern",
    company: "DataWorks India",
    recruiter: { id: 502, name: "Rajesh Kumar", email: "hr@dataworks.com", company: "DataWorks India" },
    postedAt: "2025-10-01",
    status: "Published",
    applicants: 8,
    location: "Remote",
    type: "Intern",
    experience: "0-1 yrs",
    salary: "Stipend: ₹8,000/month",
    excerpt: "Work with datasets and build dashboards.",
    description: "Join our analytics team to work on real-world data problems and create insightful visualizations.",
    requirements: ["Python", "SQL", "Excel", "Power BI"],
    flags: []
  },
  {
    id: 103,
    title: "Full Stack Developer",
    company: "TechNova",
    recruiter: { id: 503, name: "Priya Sharma", email: "priya@technova.in", company: "TechNova" },
    postedAt: "2025-10-05",
    status: "Published",
    applicants: 34,
    location: "Bangalore, India",
    type: "Full-time",
    experience: "2-4 yrs",
    salary: "₹8L - ₹12L per annum",
    excerpt: "Build scalable web applications using modern tech stack.",
    description: "We need an experienced full stack developer to work on our product suite.",
    requirements: ["Node.js", "React", "MongoDB", "AWS"],
    flags: []
  },
  {
    id: 104,
    title: "UI/UX Design Intern",
    company: "DesignHub",
    recruiter: { id: 504, name: "Ananya Reddy", email: "ananya@designhub.co", company: "DesignHub" },
    postedAt: "2025-10-08",
    status: "Flagged",
    applicants: 21,
    location: "Mumbai, India",
    type: "Intern",
    experience: "0-1 yrs",
    salary: "Unpaid",
    excerpt: "Create beautiful user interfaces and experiences.",
    description: "Looking for creative design interns to help with our client projects.",
    requirements: ["Figma", "Adobe XD", "Prototyping"],
    flags: [
      { id: 2, reason: "Unpaid internship violation", reportedAt: "2025-10-09", reportedBy: "User #1823" },
      { id: 3, reason: "Unclear job description", reportedAt: "2025-10-10", reportedBy: "User #2901" }
    ]
  },
  {
    id: 105,
    title: "Backend Developer - Node.js",
    company: "CloudSystems",
    recruiter: { id: 505, name: "Vikram Desai", email: "vikram@cloudsystems.io", company: "CloudSystems" },
    postedAt: "2025-10-10",
    status: "Published",
    applicants: 45,
    location: "Pune, India",
    type: "Full-time",
    experience: "3-5 yrs",
    salary: "₹10L - ₹15L per annum",
    excerpt: "Develop robust backend services and APIs.",
    description: "Join our backend team to build scalable microservices architecture.",
    requirements: ["Node.js", "Express", "PostgreSQL", "Docker", "Kubernetes"],
    flags: []
  },
  {
    id: 106,
    title: "Marketing Intern",
    company: "BrandBoost",
    recruiter: { id: 506, name: "Neha Gupta", email: "neha@brandboost.in", company: "BrandBoost" },
    postedAt: "2025-10-11",
    status: "Pending",
    applicants: 5,
    location: "Delhi, India",
    type: "Intern",
    experience: "0-1 yrs",
    salary: "₹5,000 - ₹8,000",
    excerpt: "Help with digital marketing campaigns and social media.",
    description: "We're looking for an enthusiastic marketing intern to support our digital campaigns.",
    requirements: ["Social Media Marketing", "Content Writing", "Google Analytics"],
    flags: []
  },
  {
    id: 107,
    title: "Mobile App Developer - React Native",
    company: "AppWorks",
    recruiter: { id: 507, name: "Arjun Patel", email: "arjun@appworks.com", company: "AppWorks" },
    postedAt: "2025-10-12",
    status: "Published",
    applicants: 28,
    location: "Ahmedabad, India",
    type: "Full-time",
    experience: "1-3 yrs",
    salary: "₹6L - ₹10L per annum",
    excerpt: "Build cross-platform mobile applications.",
    description: "Develop and maintain mobile apps for iOS and Android using React Native.",
    requirements: ["React Native", "JavaScript", "Redux", "REST APIs"],
    flags: []
  },
  {
    id: 108,
    title: "DevOps Engineer",
    company: "InfraCloud",
    recruiter: { id: 508, name: "Karan Malhotra", email: "karan@infracloud.net", company: "InfraCloud" },
    postedAt: "2025-09-28",
    status: "Removed",
    applicants: 18,
    location: "Remote",
    type: "Full-time",
    experience: "2-4 yrs",
    salary: "₹9L - ₹14L per annum",
    excerpt: "Manage CI/CD pipelines and cloud infrastructure.",
    description: "Position has been filled internally.",
    requirements: ["AWS", "Jenkins", "Docker", "Terraform"],
    flags: []
  },
  {
    id: 109,
    title: "Content Writer Intern",
    company: "WriteRight",
    recruiter: { id: 509, name: "Sneha Joshi", email: "sneha@writeright.co", company: "WriteRight" },
    postedAt: "2025-10-09",
    status: "Published",
    applicants: 14,
    location: "Remote",
    type: "Intern",
    experience: "0-1 yrs",
    salary: "₹6,000 - ₹10,000",
    excerpt: "Create engaging content for blogs and websites.",
    description: "We need talented writers to create compelling content for our clients.",
    requirements: ["Creative Writing", "SEO", "Research Skills"],
    flags: []
  },
  {
    id: 110,
    title: "Machine Learning Engineer",
    company: "AI Innovations",
    recruiter: { id: 510, name: "Rohit Mehta", email: "rohit@aiinnovations.in", company: "AI Innovations" },
    postedAt: "2025-10-11",
    status: "Pending",
    applicants: 7,
    location: "Bangalore, India",
    type: "Full-time",
    experience: "3-5 yrs",
    salary: "₹15L - ₹25L per annum",
    excerpt: "Develop and deploy machine learning models.",
    description: "Join our AI team to work on cutting-edge ML projects.",
    requirements: ["Python", "TensorFlow", "PyTorch", "ML Algorithms", "Deep Learning"],
    flags: []
  },
  {
    id: 111,
    title: "QA Tester Intern",
    company: "TestPro",
    recruiter: { id: 511, name: "Aditi Nair", email: "aditi@testpro.io", company: "TestPro" },
    postedAt: "2025-10-07",
    status: "Flagged",
    applicants: 9,
    location: "Chennai, India",
    type: "Intern",
    experience: "0-1 yrs",
    salary: "To be discussed",
    excerpt: "Test software applications and report bugs.",
    description: "Looking for detail-oriented QA testers for our projects.",
    requirements: ["Manual Testing", "Test Cases", "Bug Tracking"],
    flags: [{ id: 4, reason: "Salary not specified clearly", reportedAt: "2025-10-08", reportedBy: "User #3421" }]
  },
  {
    id: 112,
    title: "Business Analyst",
    company: "StratConsult",
    recruiter: { id: 512, name: "Kavya Reddy", email: "kavya@stratconsult.com", company: "StratConsult" },
    postedAt: "2025-10-06",
    status: "Published",
    applicants: 31,
    location: "Hyderabad, India",
    type: "Full-time",
    experience: "2-4 yrs",
    salary: "₹7L - ₹11L per annum",
    excerpt: "Analyze business requirements and create solutions.",
    description: "We need a skilled business analyst to bridge the gap between business and technology.",
    requirements: ["Requirements Analysis", "SQL", "Business Process Modeling", "Agile"],
    flags: []
  }
];

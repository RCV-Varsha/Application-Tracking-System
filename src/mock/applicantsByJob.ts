export interface Applicant {
  id: number;
  name: string;
  email: string;
  appliedAt: string;
  score: number;
  match: number;
  skills: string[];
  status: 'Pending' | 'Reviewed' | 'Interviewing' | 'Rejected' | 'Accepted';
  resumeUrl: string;
  parsed: {
    experience: string[];
    education: string[];
  };
  grammarIssues: string[];
}

export const applicantsByJob: Record<number, Applicant[]> = {
  1: [
    {
      id: 1,
      name: "Aarav Mehta",
      email: "aarav.mehta@example.com",
      appliedAt: "2025-09-30T12:34:00Z",
      score: 86,
      match: 92,
      skills: ["React", "TypeScript", "Node.js"],
      status: "Reviewed",
      resumeUrl: "/mock/resumes/aarav-mehta.pdf",
      parsed: {
        experience: ["Frontend Intern at TechNova", "Freelancer – UI Dev"],
        education: ["B.Tech in CSE – RGUKT Basar (2026)"]
      },
      grammarIssues: ["Missing summary section", "Minor tense inconsistency"]
    },
    {
      id: 2,
      name: "Sneha Reddy",
      email: "sneha.reddy@example.com",
      appliedAt: "2025-09-28T09:45:00Z",
      score: 74,
      match: 80,
      skills: ["Python", "Flask", "SQL"],
      status: "Interviewing",
      resumeUrl: "/mock/resumes/sneha-reddy.pdf",
      parsed: {
        experience: ["Backend Intern – CodeWave"],
        education: ["B.Tech in IT – RGUKT Nuzvid (2026)"]
      },
      grammarIssues: []
    },
    {
      id: 3,
      name: "Rahul Kumar",
      email: "rahul.k@example.com",
      appliedAt: "2025-09-25T14:20:00Z",
      score: 91,
      match: 95,
      skills: ["React", "Node.js", "MongoDB", "GraphQL"],
      status: "Interviewing",
      resumeUrl: "/mock/resumes/rahul-kumar.pdf",
      parsed: {
        experience: ["Full Stack Developer at StartupXYZ", "Frontend Developer at WebCorp"],
        education: ["B.Tech in Computer Science – IIT Delhi (2025)"]
      },
      grammarIssues: []
    },
    {
      id: 4,
      name: "Priya Singh",
      email: "priya.singh@example.com",
      appliedAt: "2025-09-22T11:15:00Z",
      score: 68,
      match: 72,
      skills: ["JavaScript", "CSS", "HTML"],
      status: "Rejected",
      resumeUrl: "/mock/resumes/priya-singh.pdf",
      parsed: {
        experience: ["Junior Developer at LocalTech"],
        education: ["B.Sc in Computer Applications – Delhi University (2026)"]
      },
      grammarIssues: ["Inconsistent formatting", "Several spelling errors"]
    },
    {
      id: 5,
      name: "Arjun Patel",
      email: "arjun.patel@example.com",
      appliedAt: "2025-09-20T08:30:00Z",
      score: 82,
      match: 88,
      skills: ["React", "TypeScript", "AWS", "Docker"],
      status: "Reviewed",
      resumeUrl: "/mock/resumes/arjun-patel.pdf",
      parsed: {
        experience: ["DevOps Intern at CloudScale", "Full Stack Intern at TechHub"],
        education: ["B.Tech in Information Technology – NIT Trichy (2025)"]
      },
      grammarIssues: ["Missing contact details section"]
    },
    {
      id: 6,
      name: "Neha Sharma",
      email: "neha.sharma@example.com",
      appliedAt: "2025-09-18T16:45:00Z",
      score: 79,
      match: 84,
      skills: ["Vue.js", "JavaScript", "Node.js", "PostgreSQL"],
      status: "Pending",
      resumeUrl: "/mock/resumes/neha-sharma.pdf",
      parsed: {
        experience: ["Frontend Developer at WebSolutions", "Intern at DigitalCraft"],
        education: ["B.Tech in Computer Science – VIT Vellore (2025)"]
      },
      grammarIssues: ["Unclear project descriptions"]
    }
  ],
  2: [
    {
      id: 7,
      name: "Vikram Desai",
      email: "vikram.desai@example.com",
      appliedAt: "2025-09-29T10:22:00Z",
      score: 88,
      match: 90,
      skills: ["Python", "Django", "PostgreSQL", "Redis"],
      status: "Reviewed",
      resumeUrl: "/mock/resumes/vikram-desai.pdf",
      parsed: {
        experience: ["Backend Developer at DataSystems", "Python Developer at AILabs"],
        education: ["M.Tech in Computer Science – BITS Pilani (2025)"]
      },
      grammarIssues: []
    },
    {
      id: 8,
      name: "Ananya Iyer",
      email: "ananya.iyer@example.com",
      appliedAt: "2025-09-27T13:10:00Z",
      score: 92,
      match: 94,
      skills: ["Python", "FastAPI", "Docker", "Kubernetes"],
      status: "Interviewing",
      resumeUrl: "/mock/resumes/ananya-iyer.pdf",
      parsed: {
        experience: ["Senior Backend Engineer at CloudTech", "Backend Lead at ScaleSystems"],
        education: ["B.Tech in Computer Engineering – IIT Bombay (2023)"]
      },
      grammarIssues: []
    }
  ]
};

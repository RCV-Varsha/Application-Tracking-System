import type { Job } from '../types';

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    description: `We are looking for a passionate Senior Frontend Developer to join our team and help build the future of web applications. You will work with cutting-edge technologies including React, TypeScript, and modern build tools.

Key Responsibilities:
• Develop and maintain high-quality React applications
• Collaborate with design and backend teams
• Implement responsive and accessible user interfaces
• Optimize applications for maximum speed and scalability
• Mentor junior developers and contribute to code reviews

What We Offer:
• Competitive salary and equity package
• Flexible remote work options
• Professional development budget
• Health, dental, and vision insurance
• 401(k) with company matching`,
    requirements: [
      '5+ years of React experience',
      'TypeScript proficiency',
      'Experience with modern build tools (Vite, Webpack)',
      'Strong problem-solving skills',
      'Experience with state management (Redux, Zustand)',
      'Knowledge of testing frameworks (Jest, React Testing Library)',
      'Familiarity with CI/CD pipelines'
    ],
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Git', 'Redux', 'Jest', 'Webpack', 'Node.js'],
    location: 'San Francisco, CA',
    type: 'full-time',
    salary: { min: 120000, max: 160000, currency: 'USD' },
    postedAt: '2024-01-20T10:00:00Z',
    applicantCount: 24,
    status: 'active',
    recruiterId: '2'
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    description: `Join our fast-growing startup and work on cutting-edge technology that impacts millions of users. We're building the next generation of productivity tools and need talented engineers to help us scale.

Key Responsibilities:
• Build and maintain full-stack applications using React and Node.js
• Design and implement RESTful APIs and GraphQL endpoints
• Work with databases (PostgreSQL, MongoDB) and cloud services (AWS)
• Participate in architecture decisions and technical planning
• Collaborate in an agile development environment

What We Offer:
• Equity in a fast-growing startup
• Flexible work arrangements
• Learning and development opportunities
• Modern tech stack and tools
• Collaborative and innovative culture`,
    requirements: [
      '3+ years full-stack development experience',
      'Node.js and React experience',
      'Database design knowledge (SQL/NoSQL)',
      'Agile development experience',
      'Experience with cloud platforms (AWS, GCP, Azure)',
      'Understanding of microservices architecture'
    ],
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker', 'AWS', 'GraphQL', 'MongoDB', 'Express'],
    location: 'Remote',
    type: 'full-time',
    salary: { min: 90000, max: 130000, currency: 'USD' },
    postedAt: '2024-01-18T14:30:00Z',
    applicantCount: 18,
    status: 'active',
    recruiterId: '2'
  },
  {
    id: '3',
    title: 'Product Manager Intern',
    company: 'InnovateNow',
    description: `Learn product management fundamentals while working on real products used by thousands of customers. This internship offers hands-on experience in product strategy, user research, and cross-functional collaboration.

Key Responsibilities:
• Assist in product roadmap planning and prioritization
• Conduct user research and analyze customer feedback
• Work with engineering and design teams on feature development
• Create product documentation and user stories
• Analyze product metrics and user behavior data

What You'll Learn:
• Product management methodologies (Agile, Scrum)
• User research and data analysis techniques
• Cross-functional team collaboration
• Product strategy and roadmap planning
• Market analysis and competitive research`,
    requirements: [
      'Currently pursuing relevant degree (Business, Engineering, Design)',
      'Strong analytical and problem-solving skills',
      'Excellent communication and presentation skills',
      'Interest in technology products and user experience',
      'Basic understanding of software development lifecycle'
    ],
    skills: ['Product Management', 'Analytics', 'User Research', 'Agile', 'Data Analysis', 'Communication', 'Strategy'],
    location: 'New York, NY',
    type: 'internship',
    salary: { min: 25, max: 30, currency: 'USD' },
    postedAt: '2024-01-22T09:15:00Z',
    applicantCount: 12,
    status: 'active',
    recruiterId: '2'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    description: `We're seeking a skilled DevOps Engineer to help us build and maintain scalable infrastructure. You'll work with modern cloud technologies and help streamline our development and deployment processes.

Key Responsibilities:
• Design and maintain CI/CD pipelines
• Manage cloud infrastructure on AWS/Azure
• Implement monitoring and logging solutions
• Automate deployment and scaling processes
• Ensure security best practices across all systems

What We Offer:
• Competitive salary and benefits
• Work with cutting-edge cloud technologies
• Professional certification support
• Flexible work environment
• Opportunity to mentor and lead projects`,
    requirements: [
      '4+ years of DevOps/Infrastructure experience',
      'Strong experience with AWS or Azure',
      'Proficiency in Infrastructure as Code (Terraform, CloudFormation)',
      'Experience with containerization (Docker, Kubernetes)',
      'Knowledge of monitoring tools (Prometheus, Grafana)',
      'Scripting skills (Python, Bash, PowerShell)'
    ],
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python', 'Jenkins', 'Prometheus', 'Grafana', 'Linux'],
    location: 'Austin, TX',
    type: 'full-time',
    salary: { min: 110000, max: 150000, currency: 'USD' },
    postedAt: '2024-01-19T11:45:00Z',
    applicantCount: 31,
    status: 'active',
    recruiterId: '2'
  },
  {
    id: '5',
    title: 'UX/UI Designer',
    company: 'DesignStudio Pro',
    description: `Join our creative team as a UX/UI Designer and help create beautiful, user-centered digital experiences. You'll work on diverse projects ranging from mobile apps to enterprise software.

Key Responsibilities:
• Create user-centered designs through research and testing
• Develop wireframes, prototypes, and high-fidelity mockups
• Collaborate with product managers and developers
• Conduct user interviews and usability testing
• Maintain and evolve design systems

What We Offer:
• Creative and collaborative work environment
• Latest design tools and software
• Professional development opportunities
• Flexible work arrangements
• Opportunity to work on award-winning projects`,
    requirements: [
      '3+ years of UX/UI design experience',
      'Proficiency in Figma, Sketch, or Adobe Creative Suite',
      'Strong portfolio demonstrating design process',
      'Experience with user research and testing',
      'Understanding of front-end development principles',
      'Knowledge of accessibility standards'
    ],
    skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Wireframing', 'Design Systems'],
    location: 'Los Angeles, CA',
    type: 'full-time',
    salary: { min: 85000, max: 120000, currency: 'USD' },
    postedAt: '2024-01-21T16:20:00Z',
    applicantCount: 19,
    status: 'active',
    recruiterId: '2'
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'DataInsights Corp',
    description: `We're looking for a Data Scientist to join our analytics team and help drive data-driven decision making across the organization. You'll work with large datasets and build predictive models.

Key Responsibilities:
• Analyze complex datasets to identify trends and insights
• Build and deploy machine learning models
• Create data visualizations and reports for stakeholders
• Collaborate with engineering teams on data infrastructure
• Present findings to executive leadership

What We Offer:
• Access to cutting-edge data tools and platforms
• Opportunity to work with diverse datasets
• Conference and training budget
• Collaborative research environment
• Competitive compensation and equity`,
    requirements: [
      'PhD or Masters in Data Science, Statistics, or related field',
      'Strong programming skills in Python or R',
      'Experience with machine learning frameworks (scikit-learn, TensorFlow)',
      'Knowledge of SQL and database systems',
      'Experience with data visualization tools',
      'Strong statistical analysis skills'
    ],
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'Matplotlib', 'Statistics', 'Jupyter'],
    location: 'Seattle, WA',
    type: 'full-time',
    salary: { min: 130000, max: 180000, currency: 'USD' },
    postedAt: '2024-01-17T13:30:00Z',
    applicantCount: 27,
    status: 'active',
    recruiterId: '2'
  }
];
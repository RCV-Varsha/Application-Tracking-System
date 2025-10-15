import type { Job } from '../types';

export interface ResumeEvaluation {
  score: number;
  matchPercentage: number;
  grammarIssues: string[];
  missingSections: string[];
  extractedText: string;
  keywordMatches: {
    matched: string[];
    missing: string[];
  };
  strengths: string[];
  recommendations: string[];
}

// Simulate text extraction from resume
const generateExtractedText = (filename: string): string => {
  const sampleTexts = [
    `John Doe
Software Engineer
Email: john.doe@email.com | Phone: (555) 123-4567

EXPERIENCE
Senior Frontend Developer at TechCorp (2020-2024)
• Developed React applications using TypeScript and modern build tools
• Led a team of 5 developers in building scalable web applications
• Implemented responsive designs and improved performance by 40%

Frontend Developer at StartupABC (2018-2020)
• Built user interfaces using React, Redux, and CSS
• Collaborated with designers and backend developers
• Participated in code reviews and agile development processes

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2014-2018)

SKILLS
JavaScript, TypeScript, React, Redux, CSS, HTML, Git, Node.js, Python`,
    
    `Sarah Johnson
Full Stack Developer
sarah.johnson@email.com | LinkedIn: /in/sarahjohnson

SUMMARY
Passionate full-stack developer with 4 years of experience building web applications.
Strong background in React, Node.js, and database design.

EXPERIENCE
Full Stack Developer - WebSolutions Inc. (2021-Present)
• Developed end-to-end web applications using React and Node.js
• Designed and implemented RESTful APIs and database schemas
• Worked with PostgreSQL and MongoDB databases
• Deployed applications using Docker and AWS

Junior Developer - CodeCraft (2020-2021)
• Assisted in frontend development using React and JavaScript
• Participated in daily standups and sprint planning
• Fixed bugs and implemented new features

EDUCATION
Computer Science Degree - State University (2016-2020)

TECHNICAL SKILLS
React, Node.js, JavaScript, TypeScript, PostgreSQL, MongoDB, Docker, AWS`
  ];
  
  return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
};

// Calculate keyword matches between resume and job
const calculateKeywordMatches = (extractedText: string, job: Job) => {
  const resumeWords = extractedText.toLowerCase().split(/\s+/);
  const jobSkills = job.skills.map(skill => skill.toLowerCase());
  
  const matched: string[] = [];
  const missing: string[] = [];
  
  jobSkills.forEach(skill => {
    const skillWords = skill.split(' ');
    const hasSkill = skillWords.every(word => 
      resumeWords.some(resumeWord => resumeWord.includes(word))
    );
    
    if (hasSkill) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });
  
  return { matched, missing };
};

// Generate grammar issues
const generateGrammarIssues = (): string[] => {
  const possibleIssues = [
    "Consider using active voice in experience descriptions",
    "Fix inconsistent verb tenses in work experience",
    "Add missing periods at the end of bullet points",
    "Use parallel structure in bullet points",
    "Consider using stronger action verbs",
    "Fix capitalization in section headers",
    "Remove redundant words and phrases",
    "Ensure consistent formatting throughout"
  ];
  
  const numIssues = Math.floor(Math.random() * 4) + 1;
  return possibleIssues.slice(0, numIssues);
};

// Generate missing sections
const generateMissingSections = (): string[] => {
  const allSections = ['Projects', 'Certifications', 'Awards', 'Publications', 'Volunteer Work'];
  const numMissing = Math.floor(Math.random() * 3);
  return allSections.slice(0, numMissing);
};

// Generate strengths
const generateStrengths = (keywordMatches: { matched: string[]; missing: string[] }): string[] => {
  const strengths = [
    "Strong technical skill alignment with job requirements",
    "Relevant work experience in similar roles",
    "Good educational background",
    "Clear and well-structured resume format"
  ];
  
  if (keywordMatches.matched.length > 5) {
    strengths.push("Excellent keyword match with job description");
  }
  
  return strengths.slice(0, 3);
};

// Generate recommendations
const generateRecommendations = (
  grammarIssues: string[],
  missingSections: string[],
  keywordMatches: { matched: string[]; missing: string[] }
): string[] => {
  const recommendations: string[] = [];
  
  if (grammarIssues.length > 0) {
    recommendations.push("Review and fix grammar and formatting issues");
  }
  
  if (missingSections.length > 0) {
    recommendations.push(`Consider adding ${missingSections.join(', ')} section(s)`);
  }
  
  if (keywordMatches.missing.length > 0) {
    recommendations.push(`Include more relevant keywords: ${keywordMatches.missing.slice(0, 3).join(', ')}`);
  }
  
  recommendations.push("Quantify achievements with specific numbers and metrics");
  recommendations.push("Tailor resume content to match job requirements more closely");
  
  return recommendations.slice(0, 4);
};

// Main evaluation function
export const evaluateResume = async (file: File, job: Job): Promise<ResumeEvaluation> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
  
  const extractedText = generateExtractedText(file.name);
  const keywordMatches = calculateKeywordMatches(extractedText, job);
  const grammarIssues = generateGrammarIssues();
  const missingSections = generateMissingSections();
  
  // Calculate match percentage based on keyword matches
  const matchPercentage = Math.round(
    (keywordMatches.matched.length / job.skills.length) * 100
  );
  
  // Calculate overall score (0-100)
  let score = 60; // Base score
  
  // Add points for keyword matches
  score += Math.min(keywordMatches.matched.length * 3, 25);
  
  // Subtract points for issues
  score -= grammarIssues.length * 2;
  score -= missingSections.length * 3;
  
  // Add some randomness
  score += Math.floor(Math.random() * 10) - 5;
  
  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));
  
  const strengths = generateStrengths(keywordMatches);
  const recommendations = generateRecommendations(grammarIssues, missingSections, keywordMatches);
  
  return {
    score,
    matchPercentage,
    grammarIssues,
    missingSections,
    extractedText,
    keywordMatches,
    strengths,
    recommendations
  };
};
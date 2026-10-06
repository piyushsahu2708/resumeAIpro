export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  duration: string;
  location?: string;
  description: string[];
  isCurrent?: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  details?: string;
}

export interface Project {
  id: string;
  title: string;
  techStack: string[];
  description: string;
  link?: string;
}

export interface ResumeSkills {
  technical: string[];
  soft: string[];
  tools: string[];
}

export interface ContactInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  targetRole?: string;
  contact?: ContactInfo;
  summary: string;
  skills: ResumeSkills;
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  certifications: string[];
  achievements: string[];
  rawText?: string;
  layoutTemplate?: 'modern' | 'executive' | 'minimal' | 'sidebar' | 'classic';
  createdAt: string;
  updatedAt: string;
}

export interface DiffHighlight {
  section: string;
  original: string;
  optimized: string;
  reason: string;
}

export interface SinglePageMetrics {
  totalWords: number;
  estimatedLines: number;
  fitsOnePage: boolean;
  densityScore: number;
  recommendations: string[];
}

export interface OptimizedResumeResponse {
  optimizedResume: Resume;
  originalResume: Resume;
  targetJobTitle: string;
  targetCompanyName: string;
  changesSummary: string[];
  diffHighlights: DiffHighlight[];
  singlePageMetrics: SinglePageMetrics;
  atsImprovementEstimate: {
    previousScore: number;
    projectedScore: number;
    keyEnhancements: string[];
  };
}

export interface SinglePageConfig {
  template: 'modern' | 'executive' | 'minimal' | 'sidebar' | 'classic';
  fontSize: 'compact' | 'normal' | 'spacious';
  spacing: 'tight' | 'standard' | 'relaxed';
  accentColor: 'indigo' | 'slate' | 'emerald' | 'blue' | 'rose' | 'amber';
  showProjects: boolean;
  showCertifications: boolean;
  showAchievements: boolean;
}

export interface MatchingSkill {
  name: string;
  category: string;
  matchStrength: 'high' | 'moderate';
  context?: string;
}

export interface MissingSkill {
  name: string;
  importance: 'critical' | 'preferred' | 'bonus';
  reason: string;
}

export interface MissingKeyword {
  keyword: string;
  category: 'technologies' | 'methodologies' | 'domain' | 'soft_skills';
  atsImpact: 'high' | 'medium' | 'low';
  suggestedContext: string;
}

export interface SkillGap {
  area: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  learningRecommendation: string;
}

export interface Recommendation {
  id: string;
  title: string;
  type: 'bullet_addition' | 'keyword_integration' | 'experience_refinement' | 'metric_quantification';
  originalSnippet?: string;
  suggestedRevision?: string;
  explanation: string;
  priority: 'must_fix' | 'recommended' | 'optional';
}

export interface CategoryScores {
  technicalSkills: number;
  experienceAlignment: number;
  keywordDensity: number;
  responsibilitiesMatch: number;
  atsReadiness: number;
}

export interface AtsSummary {
  parseabilityScore: number;
  formattingIssues: string[];
  positiveHighlights: string[];
}

export interface ExperienceComparison {
  requiredYears: string;
  candidateYears: string;
  verdict: string;
}

export interface AnalysisResult {
  id: string;
  userId: string;
  resumeId: string;
  resumeTitle: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  matchScore: number;
  categoryScores: CategoryScores;
  matchingSkills: MatchingSkill[];
  missingSkills: MissingSkill[];
  missingKeywords: MissingKeyword[];
  skillGaps: SkillGap[];
  recommendations: Recommendation[];
  experienceComparison: ExperienceComparison;
  atsSummary: AtsSummary;
  tailoredCoverLetterStarter: string;
  createdAt: string;
}

export interface AnalysisHistoryItem {
  id: string;
  userId: string;
  resumeId: string;
  resumeTitle: string;
  jobTitle: string;
  companyName: string;
  matchScore: number;
  categoryScores: CategoryScores;
  keyMissingSkillsCount: number;
  keyMissingSkills: string[];
  recommendationsCount: number;
  createdAt: string;
}

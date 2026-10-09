export type CardStyle = 'clean' | 'silver-shimmer' | 'matrix-rain' | 'diamond-grid' | 'tech-checker' | 'aurora-glow';

export interface CardStyleOption {
  id: CardStyle;
  name: string;
  description: string;
  badge?: string;
}

export const CARD_STYLE_OPTIONS: CardStyleOption[] = [
  {
    id: 'clean',
    name: 'Modern Clean',
    description: 'Minimalist solid card with crisp subtle borders'
  },
  {
    id: 'silver-shimmer',
    name: 'Silver Metallic Shimmer',
    description: 'Specular silver sheen with luminous reflective glass border',
    badge: 'Popular'
  },
  {
    id: 'matrix-rain',
    name: 'Matrix Cyber Rain',
    description: 'Phosphor digital code streams with glowing terminal accents',
    badge: 'Cyber'
  },
  {
    id: 'diamond-grid',
    name: 'Diamond Tech Mesh',
    description: 'Geometric diamond isometric lattice pattern'
  },
  {
    id: 'tech-checker',
    name: 'Blueprint Checker Grid',
    description: 'Architectural blueprint crosshatch with subtle coordinates'
  },
  {
    id: 'aurora-glow',
    name: 'Aurora Glass Glow',
    description: 'Multidimensional ambient gradient that illuminates on hover'
  }
];

export interface ColorTheme {
  name: string;
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  accent2: string;
  buttonGradientStart: string;
  buttonGradientEnd: string;
}

export interface PortfolioData {
  githubUsername: string;
  repoName: string;
  brandName: string;
  fullName: string;
  credentials: string;
  headline: string;
  heroSummary: string;
  heroTags: string[];
  
  aboutLabel: string;
  aboutHeading: string;
  aboutBio: string;
  
  experienceLabel: string;
  experienceHeading: string;
  experienceHighlights: string[];
  
  skillsLabel: string;
  skillsHeading: string;
  skills: string[];
  
  projectsLabel: string;
  projectsHeading: string;
  projectsLead: string;
  
  resumeHeading: string;
  resumeLead: string;
  resumeCtaText: string;
  
  contactHeading: string;
  email: string;
  location: string;
  linkedinUrl: string;
  donationUrl?: string;
  hireMeButtonText: string;
  
  theme: ColorTheme;
  cardStyle?: CardStyle;
  
  profileImage: {
    fileName: string;
    dataUrl: string; // base64
    uploaded: boolean;
  };

  logoImage?: {
    fileName: string;
    dataUrl: string; // base64
    uploaded: boolean;
  };
  
  resumePdf: {
    fileName: string;
    dataUrl: string; // base64
    uploaded: boolean;
    fileSize?: string;
  };
}

export const PRESET_THEMES: ColorTheme[] = [
  {
    name: 'Midnight Teal (Default)',
    bg: '#0b1120',
    surface: '#101a2b',
    surface2: '#162032',
    border: '#1e3a4c',
    text: '#e2e8f0',
    muted: '#94a3b8',
    accent: '#2dd4bf',
    accent2: '#38bdf8',
    buttonGradientStart: '#2dd4bf',
    buttonGradientEnd: '#0284c7'
  },
  {
    name: 'Cyber Emerald',
    bg: '#06130e',
    surface: '#0d221a',
    surface2: '#143328',
    border: '#1d4d3c',
    text: '#e6f7f0',
    muted: '#8bb8a6',
    accent: '#10b981',
    accent2: '#34d399',
    buttonGradientStart: '#10b981',
    buttonGradientEnd: '#059669'
  },
  {
    name: 'Slate Indigo',
    bg: '#090d16',
    surface: '#111827',
    surface2: '#1f2937',
    border: '#2a374d',
    text: '#f1f5f9',
    muted: '#94a3b8',
    accent: '#6366f1',
    accent2: '#818cf8',
    buttonGradientStart: '#6366f1',
    buttonGradientEnd: '#4338ca'
  },
  {
    name: 'Sunset Amber',
    bg: '#140c06',
    surface: '#22150b',
    surface2: '#331f10',
    border: '#4d3019',
    text: '#fef3c7',
    muted: '#bda68a',
    accent: '#f59e0b',
    accent2: '#fbbf24',
    buttonGradientStart: '#f59e0b',
    buttonGradientEnd: '#d97706'
  },
  {
    name: 'Crimson Nebula',
    bg: '#12080c',
    surface: '#200f16',
    surface2: '#301622',
    border: '#482033',
    text: '#ffe4e6',
    muted: '#b894a1',
    accent: '#f43f5e',
    accent2: '#fb7185',
    buttonGradientStart: '#f43f5e',
    buttonGradientEnd: '#be123c'
  },
  {
    name: 'Clean Light Slate',
    bg: '#f8fafc',
    surface: '#ffffff',
    surface2: '#f1f5f9',
    border: '#cbd5e1',
    text: '#0f172a',
    muted: '#64748b',
    accent: '#0284c7',
    accent2: '#0ea5e9',
    buttonGradientStart: '#0284c7',
    buttonGradientEnd: '#0369a1'
  }
];

export const DEFAULT_PORTFOLIO: PortfolioData = {
  githubUsername: 'davmoha',
  repoName: 'davmoha.github.io',
  brandName: 'Mo-Blind',
  fullName: 'David Mohammed',
  credentials: 'PMP, CSM, PCCSE',
  headline: 'Technical Project Manager | AI Solution Consultant',
  heroSummary: 'I turn complex workflows into clear, useful processes. Explore my work and get in touch about opportunities.',
  heroTags: ['PMP', 'CSM', 'PCCSE', 'AI Solutions'],
  
  aboutLabel: 'About me',
  aboutHeading: 'Operations-driven problem solver',
  aboutBio: 'I am an operations professional with experience organizing work, documenting processes, and collaborating across teams. I specialize in bridging the gap between business needs and technical delivery, whether that means deploying AI tools, redesigning workflows, or managing cross-functional projects.',
  
  experienceLabel: 'Experience',
  experienceHeading: 'Selected highlights',
  experienceHighlights: [
    'Delivered AI-powered tools and dashboards that reduced manual reporting and improved visibility for stakeholders.',
    'Led process redesign efforts that standardized documentation and shortened project handoffs.',
    'Collaborated with developers, designers, and business owners to ship products on time and within scope.'
  ],
  
  skillsLabel: 'Skills',
  skillsHeading: 'Tools & competencies',
  skills: [
    'Project Management',
    'Agile / Scrum',
    'Process Improvement',
    'AI Consulting',
    'Workflow Automation',
    'Technical Documentation',
    'Stakeholder Communication',
    'Web Development'
  ],
  
  projectsLabel: 'Featured Projects',
  projectsHeading: 'Featured work',
  projectsLead: 'A few standout repositories from my public GitHub work.',
  
  resumeHeading: 'Download my résumé',
  resumeLead: 'Want the full picture? Grab a copy of my résumé or reach out directly.',
  resumeCtaText: 'View my résumé (PDF)',
  
  contactHeading: 'Let’s connect',
  email: 'virtualmoha@gmail.com',
  location: 'Florida, USA',
  linkedinUrl: '',
  hireMeButtonText: 'Hire Me',
  
  theme: PRESET_THEMES[0],
  cardStyle: 'clean',
  
  profileImage: {
    fileName: 'profile.jpg',
    dataUrl: '',
    uploaded: false
  },
  
  logoImage: {
    fileName: 'logo.png',
    dataUrl: '',
    uploaded: false
  },
  
  resumePdf: {
    fileName: 'resume.pdf',
    dataUrl: '',
    uploaded: false
  }
};

export const ALEX_RIVERA_PORTFOLIO: PortfolioData = {
  githubUsername: 'alexrivera',
  repoName: 'alexrivera.github.io',
  brandName: 'Alex Rivera',
  fullName: 'Alex Rivera',
  credentials: 'Operations Specialist',
  headline: 'Operations Coordinator | Process Improvement',
  heroSummary: 'I turn complex workflows into clear, useful processes. Explore my work and get in touch about opportunities.',
  heroTags: ['Process Improvement', 'Operations', 'Workflow Automation', 'Quality Assurance'],
  
  aboutLabel: 'About me',
  aboutHeading: 'Systematic workflow specialist',
  aboutBio: 'I am an operations professional with experience organizing work, documenting processes, and collaborating across teams. Focused on optimizing turnaround time and standard operating procedures.',
  
  experienceLabel: 'Experience',
  experienceHeading: 'Key Accomplishments',
  experienceHighlights: [
    'Developed reusable intake checklist and handoff workflow reducing ticket turnaround by 35%.',
    'Managed cross-departmental documentation repository used by over 120 team members.',
    'Led standard operating procedure overhaul for customer onboarding.'
  ],
  
  skillsLabel: 'Skills & Tools',
  skillsHeading: 'Core competencies',
  skills: [
    'Process Mapping',
    'SOP Documentation',
    'Workflow Optimization',
    'Cross-team Coordination',
    'Metrics & Reporting',
    'Customer Operations'
  ],
  
  projectsLabel: 'Selected Projects',
  projectsHeading: 'Public Case Studies',
  projectsLead: 'These cards come directly from my public GitHub repositories.',
  
  resumeHeading: 'Résumé & Credentials',
  resumeLead: 'Review my complete employment history, certifications, and educational background.',
  resumeCtaText: 'View my résumé (PDF)',
  
  contactHeading: 'Get in Touch',
  email: 'alex@example.com',
  location: 'Austin, Texas',
  linkedinUrl: 'https://linkedin.com',
  hireMeButtonText: 'Contact Alex',
  
  theme: PRESET_THEMES[2], // Slate Indigo
  cardStyle: 'clean',
  
  profileImage: {
    fileName: 'profile.jpg',
    dataUrl: '',
    uploaded: false
  },
  
  logoImage: {
    fileName: 'logo.png',
    dataUrl: '',
    uploaded: false
  },
  
  resumePdf: {
    fileName: 'resume.pdf',
    dataUrl: '',
    uploaded: false
  }
};

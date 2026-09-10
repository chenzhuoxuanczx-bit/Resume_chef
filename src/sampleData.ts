import type { ResumeData } from './types'

export const sampleJobDescription = `Senior Product Marketing Manager, AI Workflow Solutions

We are looking for a product marketing leader who can translate customer pain points into crisp product positioning, launch narratives, and GTM assets. The ideal candidate has strong experience in B2B SaaS, AI-assisted workflows, user research synthesis, and cross-functional collaboration with Product, Sales, and Design.

Key responsibilities:
- Turn customer and market insights into messaging, sales narratives, and launch plans
- Work with Product teams to shape roadmap priorities and feature packaging
- Develop case studies, one-pagers, and enablement materials that show measurable business value
- Help position AI workflow products for enterprise buyers across operations, support, and internal enablement
- Comfort with analytics, experimentation, and communication with senior stakeholders
`

export const sampleResume = `Avery Chen
Email: avery.chen@example.com | Phone: +65 8123 4567 | LinkedIn: linkedin.com/in/averychen | Portfolio: averychen.dev

EDUCATION
National University of Singapore
Master of Science in Product Innovation, Singapore, 2026 - 2027

PROFESSIONAL EXPERIENCE
Nova Systems
Product Marketing Associate | Singapore | 2025 - Present
- Led launch messaging for workflow automation features across operations customers.
- Built sales decks and supported internal enablement with Product and Sales.

BrightLoop Labs
Product Analyst Intern | Singapore | 2024 - 2025
- Supported customer interviews and benchmarked competitor workflows.
- Helped summarize research into product recommendations.

PROJECTS
Support Automation Hub
- Built a dashboard concept for internal support workflows.

LEADERSHIP EXPERIENCE
Product Club, NUS
- Organized workshops for students interested in product strategy.

SKILLS
Product marketing, user research, storytelling, analytics, SQL, Figma, enablement
`

export const sampleResumeData: ResumeData = {
  name: 'Avery Chen',
  email: 'avery.chen@example.com',
  phone: '+65 8123 4567',
  linkedinUrl: 'linkedin.com/in/averychen',
  portfolioUrl: 'averychen.dev',
  targetRole: 'Senior Product Marketing Manager, AI Workflow Solutions',
  targetLocation: 'Singapore',
  education: [
    {
      school: 'National University of Singapore',
      degree: 'Master of Science in Product Innovation',
      location: 'Singapore',
      dateRange: '2026 - 2027',
    },
    {
      school: 'University of Warwick',
      degree: 'Bachelor of Arts in Management and Digital Strategy',
      location: 'Coventry, United Kingdom',
      dateRange: '2021 - 2025',
    },
  ],
  skillCategories: [
    {
      name: 'Technical Skills',
      items: [
        'SQL',
        'Figma',
        'Tableau',
        'Prompt Design',
        'AI Workflow Design',
        'Competitive Analysis',
      ],
    },
    {
      name: 'Languages',
      items: ['English (Proficient)', 'Mandarin Chinese (Native)'],
    },
  ],
  experience: [
    {
      title: 'Product Marketing Associate',
      organization: 'Nova Systems',
      location: 'Singapore',
      dateRange: '2025 - Present',
      bullets: [
        {
          skill: 'Customer Insight Translation',
          detail:
            'Synthesized 32 buyer interviews into a messaging framework used across 4 GTM launches, improving sales deck reuse by 45%.',
        },
        {
          skill: 'AI Workflow Positioning',
          detail:
            'Reframed automation features around time-to-resolution outcomes, helping the team lift enterprise demo conversion by 21% across 3 priority accounts.',
        },
        {
          skill: 'Cross-Functional Launch Planning',
          detail:
            'Coordinated Product, Sales, and Design inputs into launch assets delivered 2 weeks ahead of plan, reducing revision cycles by 30%.',
        },
      ],
    },
    {
      title: 'Product Analyst Intern',
      organization: 'BrightLoop Labs',
      location: 'Singapore',
      dateRange: '2024 - 2025',
      bullets: [
        {
          skill: 'Market Benchmarking',
          detail:
            'Compared 14 workflow platforms and distilled their strengths into a 20-page recommendation memo that informed 3 roadmap bets.',
        },
        {
          skill: 'Research Ops',
          detail:
            'Organized research notes and findings from 18 stakeholder interviews, cutting synthesis turnaround time by 40% for the product team.',
        },
      ],
    },
  ],
  projects: [
    {
      title: 'AI Support Storyboard',
      organization: 'Independent Project',
      location: 'Remote',
      dateRange: '2026',
      bullets: [
        {
          skill: 'Narrative Architecture',
          detail:
            'Designed a resume-to-storytelling workflow that turned feature notes into 6 reusable sales narratives, reducing content drafting time by 35%.',
        },
        {
          skill: 'Prototype Validation',
          detail:
            'Tested the concept with 11 peers and captured structured feedback that improved clarity scores by 27% after one iteration.',
        },
      ],
    },
  ],
  leadership: [
    {
      title: 'President',
      organization: 'NUS Product Club',
      location: 'Singapore',
      dateRange: '2025 - 2026',
      bullets: [
        {
          skill: 'Community Programming',
          detail:
            'Led 8 events for 220+ attendees around product strategy and AI workflows, increasing average session attendance by 52% year over year.',
        },
        {
          skill: 'Partnership Development',
          detail:
            'Secured 6 external speakers and sponsorship support that expanded workshop capacity by 2.4x within one semester.',
        },
      ],
    },
  ],
  awards: [
    'Graduate Innovation Fellowship, 2026',
    'Top 5 Product Challenge Finalist out of 120 teams, 2025',
  ],
}

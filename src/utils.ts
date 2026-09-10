import type { ResumeBullet, ResumeData, ResumeEntry } from './types'

const quantifiedPattern =
  /(\d+[%+]?|\$\d+|\d+[xX]|\d+\s?(users|teams|weeks|months|years|projects|clients|pages|accounts|workshops|events))/i

function fallbackName(existingResume: string) {
  const line = existingResume
    .split('\n')
    .map((value) => value.trim())
    .find(Boolean)

  return line && line.length < 80 ? line : 'Alex Morgan'
}

function ensureQuantified(bullet: ResumeBullet, index: number): ResumeBullet {
  if (quantifiedPattern.test(bullet.detail)) {
    return bullet
  }

  return {
    ...bullet,
    detail: `${bullet.detail.replace(/\.$/, '')}, improving outcomes by ${12 + index * 5}%.`,
  }
}

function normalizeEntries(entries: ResumeEntry[]) {
  return entries.map((entry) => ({
    ...entry,
    bullets: entry.bullets.map(ensureQuantified),
  }))
}

export function validateResumeData(data: ResumeData): ResumeData {
  const requiredStrings: Array<keyof ResumeData> = [
    'name',
    'email',
    'phone',
    'linkedinUrl',
    'portfolioUrl',
    'targetRole',
    'targetLocation',
  ]

  for (const key of requiredStrings) {
    const value = data[key]
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`Missing required field: ${key}`)
    }
  }

  if (!Array.isArray(data.education) || data.education.length === 0) {
    throw new Error('At least one education entry is required')
  }

  const experience = normalizeEntries(Array.isArray(data.experience) ? data.experience : [])
  const projects = normalizeEntries(Array.isArray(data.projects) ? data.projects : [])
  const leadership = normalizeEntries(Array.isArray(data.leadership) ? data.leadership : [])

  if (experience.length === 0) {
    throw new Error('At least one professional experience entry is required')
  }

  return {
    ...data,
    experience,
    projects,
    leadership,
    skillCategories: Array.isArray(data.skillCategories) ? data.skillCategories : [],
    awards: Array.isArray(data.awards) ? data.awards : [],
  }
}

function inferTargetRole(jobDescription: string) {
  const firstLine = jobDescription
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean)

  return firstLine?.slice(0, 80) || 'AI Workflow Product Marketing Lead'
}

function inferLocation(jobDescription: string) {
  const match = jobDescription.match(
    /\b(Singapore|London|Remote|New York|San Francisco|Beijing|Shanghai)\b/i,
  )

  return match?.[0] ?? 'Singapore'
}

function topSkillsFromText(source: string) {
  const library = [
    'AI Workflow Design',
    'Product Marketing',
    'User Research',
    'Go-to-Market Strategy',
    'Prompt Design',
    'Competitive Analysis',
    'Stakeholder Management',
    'Analytics',
    'Figma',
    'SQL',
  ]

  const lower = source.toLowerCase()
  const picked = library.filter((skill) => lower.includes(skill.toLowerCase()))

  return picked.length > 0 ? picked : library.slice(0, 6)
}

export function buildSampleModifiedResume(
  jobDescription: string,
  existingResume: string,
  extraInstructions: string,
): ResumeData {
  const name = fallbackName(existingResume)
  const targetRole = inferTargetRole(jobDescription)
  const targetLocation = inferLocation(jobDescription)
  const emphasis = extraInstructions.trim() || 'highlight AI workflow design and product storytelling'
  const skills = topSkillsFromText(`${jobDescription}\n${existingResume}\n${extraInstructions}`)

  return validateResumeData({
    name,
    email: 'demo.candidate@example.com',
    phone: '+65 9000 1234',
    linkedinUrl: 'linkedin.com/in/demo-candidate',
    portfolioUrl: 'demo-candidate.dev',
    targetRole,
    targetLocation,
    education: [
      {
        school: 'National University of Singapore',
        degree: 'Master of Science in Engineering Design and Innovation',
        location: 'Singapore',
        dateRange: '2025 - 2027',
      },
      {
        school: 'King’s College London',
        degree: 'Bachelor of Engineering in Electronic Engineering',
        location: 'London, United Kingdom',
        dateRange: '2021 - 2025',
      },
    ],
    skillCategories: [
      {
        name: 'Technical Skills',
        items: skills,
      },
      {
        name: 'Focus Areas',
        items: ['Resume Tailoring', 'Storytelling', emphasis],
      },
    ],
    experience: [
      {
        title: 'Senior Product Marketing Manager',
        organization: 'Northstar Workflow Labs',
        location: targetLocation,
        dateRange: '2026 - Present',
        bullets: [
          {
            skill: 'User Research & AI Workflow Design',
            detail:
              'Synthesized insights from 26 stakeholder interviews into workflow requirements and AI-assisted journey maps, reducing simulated time-to-first-response by 25%.',
          },
          {
            skill: 'Go-to-Market Messaging',
            detail:
              'Repackaged 5 feature narratives into customer-facing launch assets that improved enterprise demo-to-follow-up conversion by 19% within one quarter.',
          },
          {
            skill: 'Cross-Functional Leadership',
            detail:
              'Aligned Product, Design, and Sales teams on a shared launch plan across 3 workstreams, cutting revision cycles by 31% before release.',
          },
        ],
      },
      {
        title: 'Product Strategy Intern',
        organization: 'Aurora Systems',
        location: 'Singapore',
        dateRange: '2025 - 2026',
        bullets: [
          {
            skill: 'Competitive Strategy',
            detail:
              'Benchmarked 18 workflow and automation tools, turning findings into a 22-page recommendation pack that informed 4 roadmap priorities.',
          },
          {
            skill: 'Insight Translation',
            detail:
              'Converted research notes into structured product narratives and decision memos, reducing synthesis turnaround time by 40% for leadership reviews.',
          },
        ],
      },
    ],
    projects: [
      {
        title: 'Resume Modifier Studio',
        organization: 'Independent Project',
        location: 'Remote',
        dateRange: '2026',
        bullets: [
          {
            skill: 'Prompt Architecture',
            detail:
              'Designed a strict JSON prompting workflow that improved first-pass structured output success to 88% across 50 simulated resume rewrites.',
          },
          {
            skill: 'Template Fidelity',
            detail:
              'Mapped one fixed PDF resume layout into editable web and DOCX formats, reducing preview-to-export formatting drift by 70%.',
          },
        ],
      },
    ],
    leadership: [
      {
        title: 'Program Lead',
        organization: 'Women in Product Community',
        location: 'Singapore',
        dateRange: '2025 - 2026',
        bullets: [
          {
            skill: 'Community Operations',
            detail:
              'Ran 7 learning events for 180+ participants and improved average registration-to-attendance conversion by 34% through tighter programming themes.',
          },
        ],
      },
    ],
    awards: [
      'Innovation Venture Challenge Finalist, 2026',
      'Dean’s Leadership Citation, 2025',
    ],
  })
}

function tokenize(text: string) {
  return (text.toLowerCase().match(/[a-z][a-z0-9+\-/.]{2,}/g) ?? []).filter(
    (token) =>
      ![
        'with',
        'from',
        'that',
        'this',
        'then',
        'into',
        'your',
        'have',
        'will',
        'their',
        'about',
        'using',
        'used',
        'role',
        'team',
        'work',
        'across',
        'more',
        'than',
        'what',
      ].includes(token),
  )
}

export function analyzeMissingCoverage(
  jobDescription: string,
  resume: ResumeData | null,
) {
  if (!resume) {
    return {
      missingKeywords: [] as string[],
      missingSkills: [] as string[],
    }
  }

  const jdTokens = tokenize(jobDescription)
  const topJdTerms = [...new Set(jdTokens)].slice(0, 40)

  const resumeText = [
    resume.targetRole,
    resume.targetLocation,
    ...resume.skillCategories.flatMap((category) => category.items),
    ...resume.experience.flatMap((entry) => [
      entry.title,
      entry.organization,
      ...entry.bullets.flatMap((bullet) => [bullet.skill, bullet.detail]),
    ]),
    ...resume.projects.flatMap((entry) => [
      entry.title,
      ...entry.bullets.flatMap((bullet) => [bullet.skill, bullet.detail]),
    ]),
    ...resume.leadership.flatMap((entry) => [
      entry.title,
      ...entry.bullets.flatMap((bullet) => [bullet.skill, bullet.detail]),
    ]),
  ]
    .join(' ')
    .toLowerCase()

  const missingKeywords = topJdTerms
    .filter((term) => !resumeText.includes(term))
    .slice(0, 8)

  const jdSkillLikeTerms = topJdTerms.filter((term) =>
    [
      'strategy',
      'analytics',
      'sql',
      'figma',
      'research',
      'marketing',
      'workflow',
      'ai',
      'stakeholder',
      'launch',
      'messaging',
      'product',
      'experimentation',
      'storytelling',
      'enablement',
    ].some((needle) => term.includes(needle)),
  )

  const skillText = resume.skillCategories
    .flatMap((category) => category.items)
    .join(' ')
    .toLowerCase()

  const missingSkills = [...new Set(jdSkillLikeTerms)]
    .filter((term) => !skillText.includes(term))
    .slice(0, 6)

  return { missingKeywords, missingSkills }
}

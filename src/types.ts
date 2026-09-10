export type ResumeBullet = {
  skill: string
  detail: string
}

export type ResumeEntry = {
  title: string
  organization: string
  location: string
  dateRange: string
  bullets: ResumeBullet[]
}

export type EducationEntry = {
  school: string
  degree: string
  location: string
  dateRange: string
}

export type SkillCategory = {
  name: string
  items: string[]
}

export type ResumeData = {
  name: string
  email: string
  phone: string
  linkedinUrl: string
  portfolioUrl: string
  targetRole: string
  targetLocation: string
  education: EducationEntry[]
  skillCategories: SkillCategory[]
  experience: ResumeEntry[]
  projects: ResumeEntry[]
  leadership: ResumeEntry[]
  awards: string[]
}

export type GenerationMode = 'live' | 'sample'

export type GenerationResult = {
  data: ResumeData
  mode: GenerationMode
  warning?: string
  apiFailure?: string
}

export const resumeSchemaDescription = `
Return strict JSON only. Do not wrap in markdown fences.
Schema:
{
  "name": string,
  "email": string,
  "phone": string,
  "linkedinUrl": string,
  "portfolioUrl": string,
  "targetRole": string,
  "targetLocation": string,
  "education": [
    {
      "school": string,
      "degree": string,
      "location": string,
      "dateRange": string
    }
  ],
  "skillCategories": [
    {
      "name": string,
      "items": string[]
    }
  ],
  "experience": [
    {
      "title": string,
      "organization": string,
      "location": string,
      "dateRange": string,
      "bullets": [
        {
          "skill": string,
          "detail": string
        }
      ]
    }
  ],
  "projects": [
    {
      "title": string,
      "organization": string,
      "location": string,
      "dateRange": string,
      "bullets": [
        {
          "skill": string,
          "detail": string
        }
      ]
    }
  ],
  "leadership": [
    {
      "title": string,
      "organization": string,
      "location": string,
      "dateRange": string,
      "bullets": [
        {
          "skill": string,
          "detail": string
        }
      ]
    }
  ],
  "awards": string[]
}
Every bullet detail must include measurable impact such as a percentage, count, amount, duration, or scale.
All people, organizations, projects, and achievements must be fictional or anonymized for demo/learning use.
`.trim()

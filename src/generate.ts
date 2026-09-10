import { sampleResumeData } from './sampleData'
import type { GenerationResult, ResumeData } from './types'
import { resumeSchemaDescription } from './types'
import { buildSampleModifiedResume, validateResumeData } from './utils'

type OpenAIResponse = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

function extractJson(content: string) {
  const trimmed = content.trim()

  if (trimmed.startsWith('{')) {
    return trimmed
  }

  const match = trimmed.match(/\{[\s\S]*\}/)

  if (!match) {
    throw new Error('Model did not return JSON')
  }

  return match[0]
}

async function requestStructuredResume(
  apiKey: string,
  jobDescription: string,
  existingResume: string,
  extraInstructions: string,
  correctivePrompt?: string,
) {
  const systemPrompt = [
    'You are a resume rewriting engine for a learning/demo product.',
    'Rewrite the supplied resume against the supplied JD.',
    'Return strict JSON only.',
    resumeSchemaDescription,
  ].join('\n\n')

  const userPrompt = [
    'Job description:',
    jobDescription,
    '',
    'Existing resume:',
    existingResume,
    '',
    'Additional instructions:',
    extraInstructions || 'No extra instructions.',
    '',
    correctivePrompt ?? '',
  ]
    .filter(Boolean)
    .join('\n')

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      temperature: 0.6,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Live generation failed: ${response.status} ${text}`)
  }

  const payload = (await response.json()) as OpenAIResponse
  const content = payload.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('Model returned an empty response')
  }

  return validateResumeData(
    JSON.parse(extractJson(content)) as ResumeData,
  )
}

export async function generateResume({
  apiKey,
  jobDescription,
  existingResume,
  extraInstructions,
}: {
  apiKey: string
  jobDescription: string
  existingResume: string
  extraInstructions: string
}): Promise<GenerationResult> {
  if (!apiKey.trim()) {
    return {
      data: buildSampleModifiedResume(
        jobDescription,
        existingResume,
        extraInstructions,
      ),
      mode: 'sample',
      warning:
        'No API key detected. Showing a clearly labeled sample/demo modified resume instead of rewriting your actual resume.',
    }
  }

  try {
    const data = await requestStructuredResume(
      apiKey,
      jobDescription,
      existingResume,
      extraInstructions,
    )

    return {
      data,
      mode: 'live',
    }
  } catch (initialError) {
    try {
      const data = await requestStructuredResume(
        apiKey,
        jobDescription,
        existingResume,
        extraInstructions,
        'Your previous response was invalid. Return valid JSON that matches the schema exactly and includes measurable impact in every bullet detail.',
      )

      return {
        data,
        mode: 'live',
        warning: 'The first model response was invalid JSON, so the app retried automatically.',
      }
    } catch {
      return {
        data: {
          ...sampleResumeData,
          targetRole:
            jobDescription.split('\n').map((line) => line.trim()).find(Boolean) ||
            sampleResumeData.targetRole,
        },
        mode: 'sample',
        warning:
          initialError instanceof Error
            ? `${initialError.message} Falling back to a sample/demo modified resume.`
            : 'Live generation failed. Falling back to a sample/demo modified resume.',
      }
    }
  }
}

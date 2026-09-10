import type { GenerationResult, ResumeData } from './types'
import { resumeSchemaDescription } from './types'
import { validateResumeData } from './utils'

type OpenAIResponse = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

function normalizeApiError(text: string) {
  if (!text.trim()) {
    return 'Ark API request failed.'
  }

  return text
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

  const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'doubao-seed-1-6-thinking-250615',
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
    throw new Error(`Live generation failed: ${response.status} ${normalizeApiError(text)}`)
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
    throw new Error('An Ark API key is required. Generation was not attempted.')
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
      throw new Error(
        initialError instanceof Error
          ? initialError.message
          : 'Ark API call failed.',
      )
    }
  }
}

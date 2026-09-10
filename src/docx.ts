import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
} from 'docx'

import type { ResumeData, ResumeEntry } from './types'

function heading(text: string) {
  return new Paragraph({
    spacing: { before: 120, after: 40 },
    border: {
      bottom: {
        color: '7A7A7A',
        size: 8,
        style: 'single',
      },
    },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 22,
      }),
    ],
  })
}

function bulletLine(skill: string, detail: string) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 20 },
    children: [
      new TextRun({
        text: `${skill}: `,
        bold: true,
        size: 20,
      }),
      new TextRun({
        text: detail,
        size: 20,
      }),
    ],
  })
}

function entryBlock(entry: ResumeEntry) {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      spacing: { before: 60, after: 0 },
      tabStops: [
        {
          type: TabStopType.RIGHT,
          position: TabStopPosition.MAX,
        },
      ],
      children: [
        new TextRun({
          text: entry.organization,
          bold: true,
          size: 20,
        }),
        new TextRun({
          text: `\t${entry.dateRange}`,
          size: 20,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 0 },
      tabStops: [
        {
          type: TabStopType.RIGHT,
          position: TabStopPosition.MAX,
        },
      ],
      children: [
        new TextRun({
          text: entry.title,
          italics: true,
          size: 20,
        }),
        new TextRun({
          text: `\t${entry.location}`,
          italics: true,
          size: 20,
        }),
      ],
    }),
  ]

  for (const bullet of entry.bullets) {
    paragraphs.push(bulletLine(bullet.skill, bullet.detail))
  }

  return paragraphs
}

export async function exportResumeDocx(data: ResumeData) {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            size: 20,
          },
          paragraph: {
            spacing: { line: 240 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 792,
              right: 936,
              bottom: 792,
              left: 936,
            },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: data.name,
                bold: true,
                size: 34,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: `Email: ${data.email} | Telephone: ${data.phone} | LinkedIn: ${data.linkedinUrl} | Portfolio: ${data.portfolioUrl}`,
                size: 20,
              }),
            ],
          }),
          heading('EDUCATION'),
          ...data.education.flatMap((entry) =>
            entryBlock({
              title: entry.degree,
              organization: entry.school,
              location: entry.location,
              dateRange: entry.dateRange,
              bullets: [],
            }),
          ),
          heading('PROFESSIONAL EXPERIENCE'),
          ...data.experience.flatMap(entryBlock),
          heading('PROJECTS'),
          ...data.projects.flatMap(entryBlock),
          heading('LEADERSHIP EXPERIENCE'),
          ...data.leadership.flatMap(entryBlock),
          heading('SKILLS'),
          ...data.skillCategories.map(
            (category) =>
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 20 },
                children: [
                  new TextRun({
                    text: `${category.name}: `,
                    bold: true,
                    size: 20,
                  }),
                  new TextRun({
                    text: category.items.join(', '),
                    size: 20,
                  }),
                ],
              }),
          ),
          heading('HONOURS / AWARDS'),
          ...data.awards.map(
            (award) =>
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 20 },
                children: [new TextRun({ text: award, size: 20 })],
              }),
          ),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  // Keep the download path static-host friendly by generating the file fully in-browser.
  const slug = data.targetRole
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const fileName = slug ? `ideal-resume-${slug}.docx` : 'ideal-resume.docx'

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

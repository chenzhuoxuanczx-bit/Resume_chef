import { useState } from 'react'
import './App.css'
import { exportResumeDocx } from './docx'
import { generateResume } from './generate'
import { sampleJobDescription, sampleResume } from './sampleData'
import type { ResumeData, ResumeEntry } from './types'
import { analyzeMissingCoverage } from './utils'

type Status = 'idle' | 'loading' | 'done' | 'error'

function entryEditor(
  label: string,
  entries: ResumeEntry[],
  onChange: (next: ResumeEntry[]) => void,
) {
  return (
    <section className="editor-section">
      <div className="section-heading">
        <h3>{label}</h3>
        <span>{entries.length} item(s)</span>
      </div>
      {entries.map((entry, index) => (
        <article className="entry-editor" key={`${label}-${index}`}>
          <div className="entry-grid">
            <label>
              Title
              <input
                value={entry.title}
                onChange={(event) => {
                  const next = [...entries]
                  next[index] = { ...entry, title: event.target.value }
                  onChange(next)
                }}
              />
            </label>
            <label>
              Organization
              <input
                value={entry.organization}
                onChange={(event) => {
                  const next = [...entries]
                  next[index] = { ...entry, organization: event.target.value }
                  onChange(next)
                }}
              />
            </label>
            <label>
              Date Range
              <input
                value={entry.dateRange}
                onChange={(event) => {
                  const next = [...entries]
                  next[index] = { ...entry, dateRange: event.target.value }
                  onChange(next)
                }}
              />
            </label>
            <label>
              Location
              <input
                value={entry.location}
                onChange={(event) => {
                  const next = [...entries]
                  next[index] = { ...entry, location: event.target.value }
                  onChange(next)
                }}
              />
            </label>
          </div>
          {entry.bullets.map((bullet, bulletIndex) => (
            <div className="bullet-editor" key={`${label}-${index}-${bulletIndex}`}>
              <label>
                Bold skill label
                <input
                  value={bullet.skill}
                  onChange={(event) => {
                    const next = [...entries]
                    const bullets = [...entry.bullets]
                    bullets[bulletIndex] = {
                      ...bullet,
                      skill: event.target.value,
                    }
                    next[index] = { ...entry, bullets }
                    onChange(next)
                  }}
                />
              </label>
              <label>
                Explanation
                <textarea
                  rows={3}
                  value={bullet.detail}
                  onChange={(event) => {
                    const next = [...entries]
                    const bullets = [...entry.bullets]
                    bullets[bulletIndex] = {
                      ...bullet,
                      detail: event.target.value,
                    }
                    next[index] = { ...entry, bullets }
                    onChange(next)
                  }}
                />
              </label>
            </div>
          ))}
        </article>
      ))}
    </section>
  )
}

function previewSection(title: string, entries: ResumeEntry[]) {
  return (
    <section className="resume-section">
      <h3>{title}</h3>
      {entries.map((entry, index) => (
        <article className="resume-entry" key={`${title}-${index}`}>
          <div className="resume-line">
            <strong>{entry.organization}</strong>
            <span>{entry.dateRange}</span>
          </div>
          <div className="resume-line resume-line-muted">
            <em>{entry.title}</em>
            <em>{entry.location}</em>
          </div>
          <ul>
            {entry.bullets.map((bullet, bulletIndex) => (
              <li key={`${title}-${index}-${bulletIndex}`}>
                <strong>{bullet.skill}: </strong>
                <span>{bullet.detail}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  )
}

function App() {
  const [jobDescription, setJobDescription] = useState(sampleJobDescription)
  const [existingResume, setExistingResume] = useState(sampleResume)
  const [extraInstructions, setExtraInstructions] = useState(
    'Emphasize product marketing, AI workflow design, and quantified business outcomes.',
  )
  const [apiKey, setApiKey] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')
  const [apiFailure, setApiFailure] = useState('')
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [mode, setMode] = useState<'live' | 'sample'>('sample')

  async function handleGenerate() {
    if (!jobDescription.trim() || !existingResume.trim()) {
      setStatus('error')
      setError('Paste both a JD and an existing resume before generating.')
      return
    }

    setStatus('loading')
    setError('')
    setWarning('')
    setApiFailure('')

    try {
      const result = await generateResume({
        apiKey,
        jobDescription,
        existingResume,
        extraInstructions,
      })

      setResumeData(result.data)
      setMode(result.mode)
      setWarning(result.warning ?? '')
      setApiFailure(result.apiFailure ?? '')
      setStatus('done')
    } catch (generationError) {
      setStatus('error')
      setError(
        generationError instanceof Error
          ? generationError.message
          : 'Generation failed.',
      )
    }
  }

  const coverage = analyzeMissingCoverage(jobDescription, resumeData)

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Static GitHub Pages Resume Modifier</p>
          <h1>Modify a resume against a JD, then export a fixed DOCX.</h1>
          <p className="hero-copy">
            This prototype uses one browser-side Ark API provider, supports
            in-page editing, and exports a fixed-format DOCX inspired by
            your uploaded resume reference.
          </p>
        </div>
        <div className="hero-notes">
          <div className="hero-note">
            <strong>Fictional demo output</strong>
            <p>
              Generated people, achievements, and bullets are for learning/demo
              use only.
            </p>
          </div>
          <div className="hero-note">
            <strong>Bring your own Ark API key</strong>
            <p>Never hardcode or commit Ark API keys into source control.</p>
          </div>
        </div>
      </header>

      <main className="workspace">
        <section className="input-panel">
          <div className="panel-heading">
            <h2>Inputs</h2>
            <span>JD + existing resume + extra instructions</span>
          </div>

          <label>
            Job description
            <textarea
              rows={10}
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
            />
          </label>

          <label>
            Existing resume
            <textarea
              rows={14}
              value={existingResume}
              onChange={(event) => setExistingResume(event.target.value)}
            />
          </label>

          <label>
            Extra instruction prompt
            <textarea
              rows={5}
              value={extraInstructions}
              onChange={(event) => setExtraInstructions(event.target.value)}
            />
          </label>

          <label>
            Ark API key
            <input
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="Paste your Ark API key"
            />
          </label>

          <div className="actions">
            <button type="button" className="primary" onClick={handleGenerate}>
              {status === 'loading' ? 'Generating...' : 'Generate modified resume'}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setJobDescription(sampleJobDescription)
                setExistingResume(sampleResume)
              }}
            >
              Load sample inputs
            </button>
            <button
              type="button"
              className="secondary"
              disabled={!resumeData}
              onClick={() => resumeData && exportResumeDocx(resumeData)}
            >
              Download DOCX
            </button>
          </div>

          <div className="notice-stack">
            {warning ? <p className="notice warning">{warning}</p> : null}
            {apiFailure ? (
              <p className="notice error">
                <strong>Ark API failure flagged:</strong> {apiFailure}
              </p>
            ) : null}
            {error ? <p className="notice error">{error}</p> : null}
            <p className="notice info">
              Status:{' '}
              <strong>{mode === 'sample' ? 'sample/demo mode' : 'live mode'}</strong>
            </p>
          </div>

          {status === 'done' ? (
            <section className="gap-panel">
              <div className="section-heading">
                <h3>Flagged after this run</h3>
                <span>Missing keywords / skills under the sample button area</span>
              </div>
              <div className="gap-grid">
                <div className="gap-card">
                  <h4>Missing keywords</h4>
                  {coverage.missingKeywords.length > 0 ? (
                    <ul>
                      {coverage.missingKeywords.map((keyword) => (
                        <li key={keyword}>{keyword}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No obvious missing JD keywords were detected.</p>
                  )}
                </div>
                <div className="gap-card">
                  <h4>Missing skills</h4>
                  {coverage.missingSkills.length > 0 ? (
                    <ul>
                      {coverage.missingSkills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No obvious missing skills were detected.</p>
                  )}
                </div>
              </div>
            </section>
          ) : null}
        </section>

        <section className="preview-panel">
          <div className="panel-heading">
            <h2>Editable preview</h2>
            <span>
              {resumeData
                ? 'The web preview mirrors the fixed DOCX structure.'
                : 'Generate a resume to unlock editing and export.'}
            </span>
          </div>

          {resumeData ? (
            <div className="preview-grid">
              <div className="editor-pane">
                <section className="editor-section">
                  <div className="section-heading">
                    <h3>Identity</h3>
                    <span>Main header and contact line</span>
                  </div>
                  <div className="entry-grid">
                    <label>
                      Name
                      <input
                        value={resumeData.name}
                        onChange={(event) =>
                          setResumeData({ ...resumeData, name: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      Target role
                      <input
                        value={resumeData.targetRole}
                        onChange={(event) =>
                          setResumeData({
                            ...resumeData,
                            targetRole: event.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Email
                      <input
                        value={resumeData.email}
                        onChange={(event) =>
                          setResumeData({ ...resumeData, email: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      Phone
                      <input
                        value={resumeData.phone}
                        onChange={(event) =>
                          setResumeData({ ...resumeData, phone: event.target.value })
                        }
                      />
                    </label>
                  </div>
                </section>

                {entryEditor('Professional Experience', resumeData.experience, (next) =>
                  setResumeData({ ...resumeData, experience: next }),
                )}
                {entryEditor('Projects', resumeData.projects, (next) =>
                  setResumeData({ ...resumeData, projects: next }),
                )}
                {entryEditor('Leadership Experience', resumeData.leadership, (next) =>
                  setResumeData({ ...resumeData, leadership: next }),
                )}
              </div>

              <article className="resume-sheet">
                <header className="resume-header">
                  <h2>{resumeData.name}</h2>
                  <p>
                    Email: {resumeData.email} | Telephone: {resumeData.phone} |
                    LinkedIn: {resumeData.linkedinUrl} | Portfolio:{' '}
                    {resumeData.portfolioUrl}
                  </p>
                  <p className="target-role">
                    {resumeData.targetRole} · {resumeData.targetLocation}
                  </p>
                </header>

                <section className="resume-section">
                  <h3>Education</h3>
                  {resumeData.education.map((entry, index) => (
                    <article className="resume-entry" key={`edu-${index}`}>
                      <div className="resume-line">
                        <strong>{entry.school}</strong>
                        <span>{entry.dateRange}</span>
                      </div>
                      <div className="resume-line resume-line-muted">
                        <em>{entry.degree}</em>
                        <em>{entry.location}</em>
                      </div>
                    </article>
                  ))}
                </section>

                {previewSection('Professional Experience', resumeData.experience)}
                {previewSection('Projects', resumeData.projects)}
                {previewSection('Leadership Experience', resumeData.leadership)}

                <section className="resume-section">
                  <h3>Skills</h3>
                  <ul>
                    {resumeData.skillCategories.map((category, index) => (
                      <li key={`skill-${index}`}>
                        <strong>{category.name}: </strong>
                        <span>{category.items.join(', ')}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="resume-section">
                  <h3>Honours / Awards</h3>
                  <ul>
                    {resumeData.awards.map((award, index) => (
                      <li key={`award-${index}`}>{award}</li>
                    ))}
                  </ul>
                </section>
              </article>
            </div>
          ) : (
            <div className="empty-state">
              <h3>Ready for the first generation</h3>
              <p>
                Paste a JD, paste the current resume, optionally add steering
                instructions, then generate. If no Ark API key is present, the
                app will show a clearly labeled sample/demo modified resume.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App

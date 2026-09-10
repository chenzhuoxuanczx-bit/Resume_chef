# Ideal Resume DOCX

`ideal-resume-docx` is a static Vite + React + TypeScript app that modifies an
existing resume against a target job description, allows in-page editing, and
exports a fixed-format `.docx` file.

The hosted version is designed for GitHub Pages and does not require a backend.
Users paste their own API key into the page for live browser-side generation.
If no API key is provided, the app shows a clearly labeled sample/demo modified
resume instead of pretending to rewrite the user’s actual resume locally.

## Core workflow

1. Paste a job description.
2. Paste the current resume.
3. Optionally add extra steering instructions.
4. Paste an OpenAI-compatible API key for live generation.
5. Generate a structured modified resume.
6. Edit the generated content directly in the page.
7. Download a fixed-format `.docx`.

## Fixed template system

- `public/template.docx` is the fixed-format reference asset shipped with the project.
- The web preview mirrors the same section order and bullet treatment:
  - `Education`
  - `Professional Experience`
  - `Projects`
  - `Leadership Experience`
  - `Skills`
  - `Honours / Awards`
- Experience, project, and leadership bullets use the same pattern:
  - bold skill/ability label
  - explanation immediately after the label

The app currently generates the downloadable Word file programmatically with the
`docx` library while preserving the same fixed layout structure.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## GitHub Pages build

This project uses a Vite base path configured for a GitHub project page repo:

- `base: /ideal-resume-docx/`

To produce the exact static output for Pages:

```bash
npm run build:pages
```

That command:

1. builds the app into `dist/`
2. copies the built files into `docs/`

## GitHub Pages setup

In your GitHub repository settings:

1. Open `Settings` -> `Pages`
2. Set `Source` to `Deploy from a branch`
3. Set `Branch` to `main`
4. Set `Folder` to `/docs`
5. Save

The site will then be served from:

`https://<your-github-username>.github.io/ideal-resume-docx/`

## Usage notes

- Generated resume content is fictional/demo-oriented and should be reviewed before any real-world use.
- Do not hardcode or commit API keys.
- If live generation returns invalid JSON, the app retries once automatically.
- If live generation still fails, the UI falls back to a clearly labeled sample/demo modified resume.

## Files to know

- `src/App.tsx` — main UI and in-page editor
- `src/generate.ts` — browser-side generation flow and fallback
- `src/docx.ts` — fixed-format DOCX export
- `src/sampleData.ts` — sample JD, resume, and sample output
- `public/template.docx` — fixed template reference asset

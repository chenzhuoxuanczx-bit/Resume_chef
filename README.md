# Resume Chef

`Resume Chef` is a static Vite + React + TypeScript app that modifies an
existing resume against a target job description, allows in-page editing, and
exports a fixed-format `.docx` file.

The hosted version is designed for GitHub Pages and does not require a backend.
Users paste their own Ark API key into the page for live browser-side generation.
If no Ark API key is provided, or the API request fails, the app stops and shows
an error instead of inventing a replacement resume.

## Core workflow

1. Paste a job description.
2. Paste the current resume.
3. Optionally add extra steering instructions.
4. Paste an Ark API key for live generation.
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

This project uses a Vite base path configured for the GitHub project page repo:

- `base: /Resume_chef/`

To build the production app:

```bash
npm run build:pages
```

That command builds the app into `dist/`.

To publish to GitHub Pages from `main` + `/docs`, copy the built files into
`docs/` after the build.

### Windows PowerShell

```powershell
Remove-Item -Recurse -Force .\docs -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path .\docs | Out-Null
Copy-Item -Recurse -Force .\dist\* .\docs\
```

### macOS / Linux

```bash
rm -rf docs
mkdir -p docs
cp -R dist/. docs/
```

## GitHub Pages setup

In your GitHub repository settings:

1. Open `Settings` -> `Pages`
2. Set `Source` to `Deploy from a branch`
3. Set `Branch` to `main`
4. Set `Folder` to `/docs`
5. Save

The site will then be served from:

`https://<your-github-username>.github.io/Resume_chef/`

## Usage notes

- Do not hardcode or commit API keys.
- If live generation returns invalid JSON, the app retries once automatically.
- If the Ark API call fails, the UI stops and shows the error without generating a replacement resume.
- After each successful run, the UI flags missing keywords and missing skills under the sample-load area.

## Files to know

- `src/App.tsx` — main UI and in-page editor
- `src/generate.ts` — browser-side generation flow and error handling
- `src/docx.ts` — fixed-format DOCX export
- `src/sampleData.ts` — sample JD, resume, and sample output
- `public/template.docx` — fixed template reference asset

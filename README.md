# Ava Pandora Birthday Card

Small interactive birthday card built with React and Vite, prepared for GitHub Pages deployment.

## What is configured

- `homepage` points to `https://wntjandra.github.io/neytiri-metkayina-spider-payakan-eywa-skimwings-quaritch-loak-tulkun-omaticaya`
- Vite `base` is derived from `homepage`, so future repo renames only need one URL update
- `gh-pages` deploy script publishes `dist`
- `postbuild` copies `dist/index.html` to `dist/404.html` so GitHub Pages can serve the SPA on refresh
- Audio is tap-activated so it behaves correctly on mobile browsers

## Commands

Install everything:

```bash
npm install
npm install framer-motion lucide-react
npm install -D gh-pages
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Deploy to GitHub Pages:

```bash
npm run deploy
```

Push the initial code:

```bash
git branch -M main
git add .
git commit -m "Init birthday card and GitHub Pages deploy"
git push -u origin main
```

## GitHub Pages settings

After the first deploy creates the `gh-pages` branch:

1. Open the GitHub repository.
2. Go to `Settings` -> `Pages`.
3. Under `Build and deployment`, choose `Deploy from a branch`.
4. Select branch `gh-pages`.
5. Select folder `/ (root)`.
6. Save.

Your live site URL will be:

`https://wntjandra.github.io/neytiri-metkayina-spider-payakan-eywa-skimwings-quaritch-loak-tulkun-omaticaya`

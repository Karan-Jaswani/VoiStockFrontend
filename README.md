# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Available Scripts (Vite)

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode using Vite. Open the URL printed in the terminal (usually http://localhost:5173).

### `npm run build`

Builds the app for production to the `dist` folder using Vite.

### `npm run preview`

Locally preview the production build.

Notes:
- `index.html` is now at the project root and loads `/src/index.tsx` as a module.
- Static assets in the `public` folder are served at the root (use absolute paths like `/favicon.ico`).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Security & publishing (what to push to GitHub)

- Do NOT commit any `.env` files containing secrets or private API keys. This repo includes a `.env.example` with safe placeholder values. Copy it to `.env.local` or `.env` and fill in your real values locally.
- The `.gitignore` file already excludes `.env*`, `node_modules`, and build outputs (`dist`, `build`).
- Before pushing to GitHub, ensure you haven't accidentally committed secrets. If you have, remove them from the repo history (see steps below).

If you accidentally committed a secret and pushed it, follow these steps locally to remove it from history (WARNING: rewriting history will change commit SHAs):

1. Remove the file and commit:

	git rm --cached .env
	git commit -m "remove .env"

2. Remove the file from all history using the `git filter-branch` or `git filter-repo` tool. For small repos you can use:

	git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all

3. Force-push the cleaned history:

	git push origin --force --all

Note: If you are unsure about rewriting history, create a new repository and push a fresh clean copy.

When sharing the project publicly (LinkedIn/GitHub):

- Share only this repository (with `.env` ignored). Use `.env.example` to show what variables are required.
- Remove or redact any private endpoints, credentials, or internal company data before publishing.

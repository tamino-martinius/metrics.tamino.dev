# GitHub Contributions UI

[Visit Website](https://contributions.taminomartinius.de)

![Preview](public/preview.gif?raw=true)

## Tech Stack

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 6
- [Vite](https://vite.dev/)
- [D3](https://d3js.org/) for charts and visualizations
- [Sass](https://sass-lang.com/) for styling

## Data Source

Contribution statistics are fetched at runtime from the [github-stats](https://github.com/tamino-martinius/github-stats) repository. No local data files are needed.

To add or change accounts, edit the `ACCOUNT_URLS` array in `src/models/Data.ts`.

## Run locally

- `npm install` (once)
- `npm run dev` (to start the Vite dev server)

## Build

- `npm run build` (outputs to `dist/`)
- `npm run preview` (preview the production build locally)

## Deploy

Run `npm run deploy` to deploy via the deploy script.

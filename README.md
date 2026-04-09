# Metrics UI

[Visit Website](https://metrics.tamino.dev)

![Preview](public/preview.mp4)

A personal metrics dashboard that visualizes GitHub contribution data and npm package statistics. Data is fetched at runtime from companion stats repositories — no local data files are needed.

## Tech Stack

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 6
- [Vite](https://vite.dev/)
- [D3](https://d3js.org/) for charts and visualizations

## Data Sources

### GitHub Stats

Contribution statistics are fetched from the [github-stats](https://github.com/tamino-martinius/github-stats) repository. The stats repo syncs your GitHub contributions daily via GitHub Actions and publishes aggregated JSON. Private repository details (names, URLs, languages) are stripped — only commit counts and line changes are included.

**Setup your own:**

1. Fork [github-stats](https://github.com/tamino-martinius/github-stats)
2. Enable GitHub Actions on the fork
3. Add repository secrets:
   - `GH_PAT` — Personal Access Token with `repo` and `read:org` scopes ([create one](https://github.com/settings/tokens))
   - `ENCRYPTION_KEY` — `openssl rand -hex 32`
4. Run **Actions > Setup User Branch > Run workflow**
5. Enable **Actions > Sync GitHub Stats** (scheduled workflows need manual activation on forks)
6. Stats sync daily at midnight UTC. Data is available at:
   ```
   https://raw.githubusercontent.com/<you>/github-stats/<you>/data/stats.json
   ```

To add or change GitHub accounts in this dashboard, edit `GITHUB_ACCOUNTS` in `src/models/Data.ts`.

### npm Stats

Package and download statistics are fetched from the [npm-stats](https://github.com/tamino-martinius/npm-stats) repository. The stats repo syncs your npm packages and download counts every 6 hours via GitHub Actions. No npm token is needed — the npm registry API is public.

**Setup your own:**

1. Fork [npm-stats](https://github.com/tamino-martinius/npm-stats)
2. Enable GitHub Actions on the fork
3. Add repository secret:
   - `ENCRYPTION_KEY` — `openssl rand -hex 32`
4. Run **Actions > Setup User Branch > Run workflow** (enter your npm username when prompted)
5. Enable **Actions > Sync npm Stats** (scheduled workflows need manual activation on forks)
6. Stats sync every 6 hours. Data is available at:
   ```
   https://raw.githubusercontent.com/<you>/npm-stats/<you>/data/stats.json
   ```

To change the npm account, edit `NPM_ACCOUNT` in `src/models/Data.ts`.

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

## Deploy

```sh
npm run deploy
```

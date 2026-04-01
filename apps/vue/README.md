# NaturalEvents — Vue

Real-time earthquake and natural event monitoring dashboard built with Vue, TypeScript, and Vite.

![Dashboard Screenshot](../../docs/screenshot.png)

## Description

An interactive dashboard that visualizes earthquake data from the USGS API and natural events from NASA's EONET API. Features include a Leaflet map with magnitude-scaled markers, filterable data views, analytics charts, and detailed event pages.

## Live Site

https://natural-events-vue.vercel.app

## Getting Started

From the monorepo root:

```bash
npm install
npm run dev:vue
```

The app runs on http://localhost:3001.

## Scripts

| Command                   | Description                              |
| ------------------------- | ---------------------------------------- |
| `npm run dev`             | Start development server                 |
| `npm run build`           | Type-check and build for production      |
| `npm run preview`         | Preview the production build             |
| `npm run test`            | Run component tests with Vitest          |
| `npm run lint`            | Lint source files with ESLint            |
| `npm run format`          | Format source files with Prettier        |
| `npm run format:check`    | Check formatting without writing         |
| `npm run e2e`             | Run Playwright end-to-end tests          |
| `npm run storybook`       | Start Storybook on http://localhost:6007 |
| `npm run build-storybook` | Build static Storybook site              |

## Tech Stack

- Vue 3.5 with Vue Router
- Pinia for state management
- @vue-leaflet/vue-leaflet for interactive maps
- vue-chartjs + Chart.js for analytics charts
- Tailwind CSS for styling
- Vitest + Vue Test Utils for component tests
- Playwright for E2E tests
- Storybook for component stories

## APIs

- [USGS Earthquake API](https://earthquake.usgs.gov/fdsnws/event/1/) — real-time seismic data
- [NASA EONET v3](https://eonet.gsfc.nasa.gov/docs/v3) — natural event tracking (wildfires, storms, volcanoes)

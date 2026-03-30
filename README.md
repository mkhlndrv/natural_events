# NaturalEvents

Real-time earthquake and natural event monitoring dashboard. Built with React and Vue side by side in a shared monorepo, comparing both frameworks by implementing the same application twice.

![Dashboard Screenshot](docs/screenshot.png)

## Features

- Interactive Leaflet map with earthquake and natural event markers
- Earthquake markers sized by magnitude and colored by depth
- EONET markers color-coded by category (wildfires, storms, volcanoes, etc.)
- Filter panel: event type toggle, magnitude range, date range, EONET status
- Stats bar showing earthquake count, natural event count, and strongest quake
- Analytics page with magnitude distribution bar chart and events-over-time line chart
- Event detail pages for individual earthquakes and EONET events
- Identical apps in React and Vue for framework comparison

## Tech Stack

| Area      | React App              | Vue App                  |
| --------- | ---------------------- | ------------------------ |
| Framework | React 19               | Vue 3.5                  |
| Routing   | React Router           | Vue Router               |
| State     | Zustand                | Pinia                    |
| Maps      | react-leaflet          | @vue-leaflet/vue-leaflet |
| Charts    | Recharts               | vue-chartjs + Chart.js   |
| Testing   | @testing-library/react | @vue/test-utils          |

**Shared:** TypeScript, Vite, Tailwind CSS, Vitest, Storybook, Axios

## Project Structure

```
natural_events/
├── apps/
│   ├── react/          # React app
│   └── vue/            # Vue app
├── packages/
│   └── shared/         # Shared types and constants
├── .github/
│   └── workflows/      # CI pipeline
└── package.json        # Monorepo root (npm workspaces)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

## Scripts

### Development

| Command             | Description            |
| ------------------- | ---------------------- |
| `npm run dev:react` | Start React dev server |
| `npm run dev:vue`   | Start Vue dev server   |

### Storybook

| Command                   | Description                              |
| ------------------------- | ---------------------------------------- |
| `npm run storybook:react` | React Storybook on http://localhost:6006 |
| `npm run storybook:vue`   | Vue Storybook on http://localhost:6007   |

### Testing

| Command              | Description                 |
| -------------------- | --------------------------- |
| `npm run test`       | Run all tests (React + Vue) |
| `npm run test:react` | React tests only            |
| `npm run test:vue`   | Vue tests only              |

### Build

| Command               | Description                |
| --------------------- | -------------------------- |
| `npm run build:react` | Production build for React |
| `npm run build:vue`   | Production build for Vue   |

### Linting & Formatting

| Command                | Description                   |
| ---------------------- | ----------------------------- |
| `npm run lint`         | Run ESLint across both apps   |
| `npm run format`       | Format code with Prettier     |
| `npm run format:check` | Check formatting (used in CI) |

## APIs

- [USGS Earthquake API](https://earthquake.usgs.gov/fdsnws/event/1/) — real-time seismic data from the U.S. Geological Survey
- [NASA EONET v3](https://eonet.gsfc.nasa.gov/docs/v3) — Earth Observatory Natural Event Tracker (wildfires, storms, volcanoes, etc.)

## Deployment

Both apps deploy to Vercel from this monorepo.

- **React:** https://natural-events-react.vercel.app
- **Vue:** https://natural-events-vue.vercel.app

## License

MIT

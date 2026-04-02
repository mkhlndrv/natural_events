# Presentation Guide — Criteria Walkthrough

This guide covers each grading criteria, explains where it's fulfilled in the codebase, how it works technically, and what to show/say during the presentation. Code snippets and file paths included so you can navigate quickly.

**How to use this if you are newer to this kind of project**

- **Monorepo** = one Git repository containing several packages (here: React app, Vue app, shared library). You run `npm install` once at the root; npm wires them together.
- **Service** = a module whose job is only to talk to the HTTP API (build URLs, call Axios, return data). **Hook / composable** = React/Vue logic that calls the service and keeps `loading`, `error`, and `data` in component-friendly form.
- **Store** = a small global place for “app-wide” state (your filters). Without it, every page would need props passed down through many components.
- **Code blocks below are teaching copies:** inline `//` comments were added **only in this Markdown file** so you can read or present what each part does. The real source files in `apps/` are unchanged.

---

## 1. Two apps in two different front-end frameworks

> _I have 2 repos of the same app in 2 different front-end frameworks that are either React, Vue, Svelte, Solid or Angular._

### Where it is

- **React app:** `apps/react/` — React 19 + React Router + Zustand + Recharts + react-leaflet
- **Vue app:** `apps/vue/` — Vue 3.5 + Vue Router + Pinia + vue-chartjs + @vue-leaflet

### How it works

Both apps live in a single **npm workspaces monorepo**. The root `package.json` (line 5-8) declares:

```json
"workspaces": [
  "apps/*",
  "packages/*"
]
```

**What each part means (say this in your own words):**

- **`"workspaces"`** — Tells npm this repo is a _workspace root_: child folders listed here are separate packages that share one lockfile and can depend on each other.
- **`"apps/*"`** — Every app under `apps/` (React, Vue) is its own package with its own dependencies.
- **`"packages/*"`** — Shared libraries (here, `packages/shared`) are normal packages too; the apps depend on them by name (e.g. `@terrawatch/shared`).

**In plain English:** These lines are glob patterns. Each matching folder has its own `package.json`, but one `npm install` at the repo root links them. That is how both apps can import from `@terrawatch/shared` without publishing that package to npm.

This means `npm install` at the root installs dependencies for all three packages (`apps/react`, `apps/vue`, `packages/shared`). Both apps import shared types and API constants from `packages/shared/` using the workspace name `@terrawatch/shared`.

### What to show

- Open the project root in your editor — show the `apps/react/` and `apps/vue/` folders side by side.
- Open `package.json` at root and point to the `"workspaces"` field.
- Open `packages/shared/index.ts` to show the shared exports.

### What to say

> "I built the same app in React and Vue. They're in a monorepo using npm workspaces, and they share TypeScript types and API constants from a shared package. This means if I change an API URL or a type definition, both apps pick it up."

---

## 2. Not using templates or pre-built apps

> _I am not using templates or pre-built apps._

### How to prove it

- The apps were scaffolded with `npm create vite@latest` (a bare Vite starter that gives you an empty `App.tsx`/`App.vue` and nothing else), then **everything** was built from scratch.
- No leftover boilerplate exists — no default counter component, no template logos, no `App.css` with Vite template styles.
- Every component is custom-built:
  - **5 components:** FilterPanel, EventMap, StatsBar, Navbar, Layout
  - **4 pages:** Dashboard, EventDetail, Analytics, About
  - **2 services:** usgs.ts, eonet.ts
  - **2 hooks/composables:** useEarthquakes, useEonetEvents
  - **1 store:** filterStore

### What to show

- Quickly browse through `apps/react/src/` — point out that every file is project-specific.
- If asked, show git log: "You can see from the git history that each component was added incrementally in separate commits."

### What to say

> "I started from a blank Vite + React/Vue template and built everything myself — all the routing, state management, API integration, map rendering, charts, and filtering logic."

---

## 3. Apps fetch data from an API and do something with it

> _My 2 apps fetch data from an api and do something with that data._

### Where it is

**API base URLs** — `packages/shared/constants.ts`:

**Why this file matters:** If an API changes domain or path, you edit _one_ place and both React and Vue stay in sync. Graders also like that you did not scatter magic strings across components.

```ts
// USGS = U.S. Geological Survey earthquake API (query + feeds).
export const USGS_QUERY_URL =
  'https://earthquake.usgs.gov/fdsnws/event/1/query';
export const USGS_FEED_URL =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';
// EONET = NASA “natural events” API (fires, storms, volcanoes, etc.).
export const EONET_EVENTS_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events';
export const EONET_CATEGORIES_URL =
  'https://eonet.gsfc.nasa.gov/api/v3/categories';
```

All URLs are centralized here. Never hardcoded in components or services.

**Service layer** (identical logic in both apps):

- `apps/react/src/services/usgs.ts` — `fetchEarthquakes(params)` and `fetchEarthquakeById(id)`
- `apps/react/src/services/eonet.ts` — `fetchEonetEvents(params)` and `fetchEonetEventById(id)`

Here's how `fetchEarthquakes` works (React version, Vue is identical):

**Big picture:** This function is a thin “HTTP wrapper.” It does not know about React or maps — it only knows how to ask USGS for earthquake data and return the parsed body.

```ts
// `async` = function returns a Promise; you can `await` it from hooks/composables.
export async function fetchEarthquakes(
  params: UsgsParams
): Promise<EarthquakeFeatureCollection> {
  // GET request: Axios builds the query string from `params` (dates, magnitudes, etc.).
  const response = await axios.get(USGS_QUERY_URL, {
    // Spread `...params` merges your filters with `format: 'geojson'` (required by USGS).
    params: { format: 'geojson', ...params },
  });
  // Axios already parsed JSON → `response.data` is the GeoJSON object.
  return response.data;
}
```

It sends an HTTP GET to the USGS API with `format=geojson` plus any filter params (`starttime`, `endtime`, `minmagnitude`, `maxmagnitude`). The USGS API returns a **GeoJSON FeatureCollection** (a standard format: a list of “features,” each with geometry + properties like magnitude).

**Data-fetching hooks/composables** — these sit between services and components:

- React: `apps/react/src/hooks/useEarthquakes.ts`
- Vue: `apps/vue/src/composables/useEarthquakes.ts`

React version:

**Big picture:** A **custom hook** is a function that uses other hooks (`useState`, `useEffect`, `useFilterStore`). Components call `useEarthquakes()` and get `{ data, loading, error }` without duplicating fetch logic.

```ts
export function useEarthquakes() {
  // Read current filter values from the global Zustand store (same source as FilterPanel).
  const { minMagnitude, maxMagnitude, startDate, endDate } = useFilterStore();
  // Local state for this hook only: list of earthquake features, loading flag, error message.
  const [data, setData] = useState<EarthquakeFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // `useEffect` runs after render. The second argument is the "dependency array."
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchEarthquakes({
      // USGS query param names are lowercase with no camelCase.
      starttime: startDate,
      endtime: endDate,
      minmagnitude: minMagnitude,
      maxmagnitude: maxMagnitude,
    })
      // GeoJSON FeatureCollection has `.features` — the array you map over on the map.
      .then((response) => setData(response.features))
      .catch((err) => {
        setError(err.message);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [minMagnitude, maxMagnitude, startDate, endDate]);
  // ☝️ Whenever ANY of these change, React re-runs this effect → new API call.

  // Parent components destructure this to render the map, stats, charts.
  return { data, loading, error };
}
```

It reads filter values from the Zustand store, and the `useEffect` dependency array `[minMagnitude, maxMagnitude, startDate, endDate]` means it **automatically re-fetches** whenever any filter changes.

Vue uses **`watch`** instead of `useEffect`, with **`immediate: true`** so the first run happens on mount (like React’s effect on first paint). Same idea: when any filter ref changes, run the fetch again.

```ts
watch(
  // Watch several refs at once (Pinia/composable refs).
  [minMagnitude, maxMagnitude, startDate, endDate],
  () => {
    // Same as inside useEffect: set loading, call fetchEarthquakes, update data/error.
  },
  { immediate: true } // Run once immediately, not only after a later change.
);
```

**Shared TypeScript types** — `packages/shared/types/earthquake.ts` and `eonet.ts`:

**Why types matter:** TypeScript describes the _shape_ of API responses. If you typo `properties.mag`, the compiler warns you before runtime. Sharing types means React and Vue cannot accidentally drift to two different “meanings” of an earthquake.

- **`EarthquakeFeature`** — One quake from USGS GeoJSON: `properties` holds magnitude (`mag`), human place name, Unix time, “felt” count, tsunami flag, etc.; `geometry` is usually a `Point` where coordinates are `[longitude, latitude, depth]` (depth often in km — be ready to say “depth comes from the API”).
- **`EonetEvent`** — One NASA event: `id`, `title`, list of `categories`, `sources` (URLs), `geometry` (can be points or polygons), and `closed` (still active or not).
- Both apps import these types, so the data shape is consistent everywhere.

### What the data is used for

1. **Dashboard map** — earthquake markers sized by magnitude, colored by depth; EONET markers colored by category
2. **Stats bar** — earthquake count, natural event count, strongest quake magnitude
3. **Analytics charts** — magnitude distribution bar chart, events-over-time line chart
4. **Event detail page** — full event info (magnitude, depth, location, felt reports, tsunami status, sources)

### What to show

1. Open `packages/shared/constants.ts` — show the centralized URLs
2. Open `apps/react/src/services/usgs.ts` — show the `fetchEarthquakes()` Axios call
3. Open `apps/react/src/hooks/useEarthquakes.ts` — show the `useEffect` with filter dependencies
4. Open the live app dashboard — show data on the map and change a filter to trigger a re-fetch

### What to say

> "I use two free APIs — USGS for earthquake data and NASA EONET for natural events like wildfires and storms. The service layer makes Axios calls with filter parameters. The hooks/composables manage loading and error state, and automatically re-fetch whenever the user changes a filter. All API URLs are centralized in the shared package."

---

## 4. User interaction (click to navigate, click to expand)

> _My 2 apps have user interaction (click to navigate, click to expand)._

### Where it is — Interaction inventory

**1. Navigation (Navbar)**

- File: `apps/react/src/components/Navbar.tsx` / `apps/vue/src/components/AppNavbar.vue`
- 3 links: Dashboard (`/`), Analytics (`/analytics`), About (`/about`)
- React uses `NavLink` with `isActive` for styling; Vue uses `RouterLink` with `exact-active-class`
- Active link gets indigo background color

**2. Map marker click → popup (EventMap)**

- File: `apps/react/src/components/EventMap.tsx` (lines 43-103)
- Each earthquake is rendered as a `<CircleMarker>`. Clicking it opens a `<Popup>` showing:
  - Magnitude, location, depth, timestamp
  - A "View details" link to `/event/{id}`
- Same for EONET events (title, category, status, "View details" link)

**3. Popup "View details" → navigation to Event Detail**

- The `<Link to={/event/${eq.id}}>` in the popup navigates to the detail page
- File: `apps/react/src/pages/EventDetail.tsx`
- The page reads the `:id` from the URL, checks if it starts with `EONET_` to decide which API to call, then fetches and displays the full event

**4. Event Detail → back to Dashboard**

- `<Link to="/">← Back to Dashboard</Link>` at the top of every detail page

**5. Filter panel interactions (FilterPanel)**

- File: `apps/react/src/components/FilterPanel.tsx` (152 lines)
- **Event type toggle buttons** (line 34-46): Three buttons — clicking one calls `setEventType()` on the store. Active button gets `bg-indigo-600 text-white`.
- **Magnitude inputs** (line 57-66): Number inputs with min=0, max=10, step=0.5. `onChange` calls `setMinMagnitude(Number(e.target.value))`.
- **Date pickers** (line 95-117): HTML date inputs. `onChange` calls `setStartDate(e.target.value)`.
- **EONET status dropdown** (line 127-138): `<select>` with options All/Open/Closed.
- **Reset button** (line 141-146): Calls `resetFilters()` which resets all values to defaults (eventType: 'all', magnitude: 2-10, dates: last 30 days, eonetStatus: 'open').

**6. Analytics page — filters affect charts**

- File: `apps/react/src/pages/Analytics.tsx`
- Same FilterPanel appears here, so changing filters updates the charts in real time
- The charts read from the same hooks that read from the store

### What to show (live demo)

1. Click through navbar links — watch the active state change
2. On the dashboard, click a map marker — show the popup expanding
3. Click "View details" in the popup — navigate to the detail page
4. Click "← Back to Dashboard" — navigate back
5. Change the event type toggle to "Earthquakes" — watch EONET markers disappear
6. Change min magnitude to 5 — watch small markers disappear
7. Change a date — watch data reload
8. Click "Reset" — everything reverts to defaults

### What to say

> "There's user interaction on every page. The main ones: click markers on the map to see popups, click through to detail pages, use the filter panel to adjust what data is shown. Filters are in a global store so they affect the map, stats bar, and analytics charts simultaneously."

---

## 5. Package.json scripts for lint, format, test, and e2e

> _My 2 apps have scripts in their package.json files to: lint (eslint), format (prettier), component test (vitest) and e2e test (playwright) the codebase._

### Where it is

**React (`apps/react/package.json`):**
| Script | Command | Tool |
|--------|---------|------|
| `lint` | `eslint src --ext .ts,.tsx` | ESLint |
| `format` | `prettier --write 'src/**/*.{ts,tsx,css,json}'` | Prettier (auto-fix) |
| `format:check` | `prettier --check 'src/**/*.{ts,tsx,css,json}'` | Prettier (check only) |
| `test` | `vitest run` | Vitest |
| `e2e` | `npx playwright test --project=react --config=../../playwright.config.ts` | Playwright |
| `storybook` | `storybook dev -p 6006` | Storybook |

**Vue (`apps/vue/package.json`):**
| Script | Command | Tool |
|--------|---------|------|
| `lint` | `eslint src --ext .ts,.vue` | ESLint |
| `format` | `prettier --write 'src/**/*.{ts,vue,css,json}'` | Prettier (auto-fix) |
| `format:check` | `prettier --check 'src/**/*.{ts,vue,css,json}'` | Prettier (check only) |
| `test` | `vitest run` | Vitest |
| `e2e` | `npx playwright test --project=vue --config=../../playwright.config.ts` | Playwright |
| `storybook` | `storybook dev -p 6007` | Storybook |

**Root scripts** (`package.json`) — convenience commands that run both apps:
| Script | What it does |
|--------|-------------|
| `npm run lint` | `eslint 'apps/*/src/**/*.{ts,tsx,vue}'` — lints both apps at once |
| `npm run format` | `prettier --write 'apps/*/src/**/*.{ts,tsx,vue,css,json}'` |
| `npm run format:check` | `prettier --check 'apps/*/src/**/*.{ts,tsx,vue,css,json}'` |
| `npm run test` | `npm run test:react && npm run test:vue` — runs Vitest in both |
| `npm run e2e` | `npx playwright test` — runs all Playwright projects |

### How the E2E script works

The Playwright config (`playwright.config.ts`) defines two **projects**. Think of a project as “one browser profile + one base URL + one folder of tests.” Same Playwright run can test both apps without you manually switching terminals.

```ts
projects: [
  // React E2E tests live under e2e/react; open pages relative to the React dev server.
  { name: 'react', testDir: './e2e/react', use: { baseURL: 'http://localhost:3000' } },
  // Vue tests mirror that on port 3001.
  { name: 'vue', testDir: './e2e/vue', use: { baseURL: 'http://localhost:3001' } },
],
// `webServer` = "before tests, start these commands and wait until URLs respond."
webServer: [
  { command: 'npm run dev:react', url: 'http://localhost:3000' },
  { command: 'npm run dev:vue', url: 'http://localhost:3001' },
],
```

So `npm run e2e` automatically starts both dev servers, runs tests against them, then shuts them down.

### What to show

- Open `apps/react/package.json` and scroll to the `scripts` section.
- Run `npm run lint` from root — show it exits with 0.
- Run `npm run test` — show Vitest output for both apps.

### What to say

> "Both apps have all required scripts: lint with ESLint, format with Prettier (plus a check-only version for CI), component tests with Vitest, and E2E tests with Playwright. The root package.json has convenience scripts to run everything at once."

---

## 6. Properly linted, formatted, and all tests pass

> _My 2 apps are properly linted, formatted and pass all tests._

### Where it is

**ESLint config** — `.eslintrc.cjs` at root (shared by both apps):

**Big picture:** ESLint scans code for likely bugs and style issues. Here it understands TypeScript and cooperates with Prettier so “formatting” and “lint” do not fight each other.

```js
module.exports = {
  root: true, // Use this config as the root — don’t keep searching parent folders.
  parser: '@typescript-eslint/parser', // Parse TypeScript syntax, not plain JS only.
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended', // Baseline JS rules.
    'plugin:@typescript-eslint/recommended', // Common TS rules (any types, etc.).
    'plugin:prettier/recommended', // Run Prettier as ESLint rules (one toolchain).
  ],
  rules: {
    'prettier/prettier': 'warn', // If formatting drifts, ESLint warns.
    // Catch unused variables; allow `_name` for intentionally unused parameters.
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
```

This means: TypeScript-aware linting, Prettier formatting enforced as lint rules, unused variables flagged (except those starting with `_`).

**Prettier config** — `.prettierrc`:

**What this does:** Prettier is an _opinionated formatter_ — it rewrites spacing, quotes, and commas so the whole team (and CI) sees the same shape of code.

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

- **`semi`** — end statements with semicolons (consistent with many TS codebases).
- **`singleQuote`** — use `'` instead of `"` for strings where possible.
- **`tabWidth`** — indent with 2 spaces.
- **`trailingComma`** — allow trailing commas in objects/arrays where ES5 allows (helps cleaner git diffs).

**Git hooks** — `.husky/pre-commit` runs `npx lint-staged`, which (from root `package.json` `lint-staged` config):

- `.ts/.tsx` files: `eslint --fix` then `prettier --write`
- `.vue` files: `eslint --fix` then `prettier --write`
- `.json/.css/.md` files: `prettier --write`

This means code is **automatically linted and formatted before every commit**. It's impossible to commit unlinted code.

### How to demonstrate

1. Run `npm run lint` — exits with 0 (no errors)
2. Run `npm run format:check` — exits with 0 (all files properly formatted)
3. Run `npm run test` — runs **both** apps; you should see **16** component tests total (8 per app: 6 FilterPanel + 2 Navbar)

### What to say

> "The codebase passes all lint checks and formatting rules. I have Husky set up with a pre-commit hook that runs lint-staged — so every time I commit, ESLint and Prettier run automatically on the staged files. You literally can't commit code that doesn't pass."

---

## 7. Connected to Vercel for automated deployments

> _My 2 apps are connected to vercel (or similar) for automated deployments._

### Where it is

- **React live URL:** https://natural-events-react.vercel.app
- **Vue live URL:** https://natural-events-vue.vercel.app

### How it works

- Both are deployed as **separate Vercel projects** from the same GitHub monorepo.
- Each Vercel project is configured to build from its respective directory:
  - React project root: `apps/react`
  - Vue project root: `apps/vue`
- Vercel auto-detects Vite, runs `npm run build`, and serves the `dist/` folder.
- **Automatic deployment:** every push to `main` triggers a new production deployment. Every PR gets a preview deployment with a unique URL.

### What to show

- Open both live URLs in browser tabs — show them working.
- Optionally open the Vercel dashboard to show the deployment history and settings.

### What to say

> "Both apps are connected to Vercel. When code gets pushed to main, Vercel automatically builds and deploys both apps. Each PR also gets a preview deployment so I can test before merging."

---

## 8. GitHub workflow for CI (lint, format, test, e2e on PR)

> _My 2 apps have a github workflow that, on each pull request to main, will run lint check, format check, component test and e2e test. If those pass, it will deploy it to vercel (or similar)._

### Where it is

- **File:** `.github/workflows/ci.yml`
- **Triggers on:** `pull_request` to `main` branch

### How it works — the full pipeline

The workflow has **2 jobs that run in parallel:**

**Job 1: "Lint, Format and Test"**

Below is a **readable summary** of the job (not a copy-paste of the real YAML). When you present, say that each bullet is a CI _step_: a command GitHub runs on a clean Linux machine.

```yaml
# Logical name shown in the GitHub “Checks” UI.
ci:
  name: Lint, Format and Test
  runs-on: ubuntu-latest # Fresh virtual machine every run — reproducible.
  steps:
    - Checkout code # Clone your PR branch.
    - Setup Node.js 20 with npm cache # Install Node + cache node_modules for speed.
    - npm ci # Clean install from package-lock (stricter than npm install).
    - npm run lint # ESLint must pass; CI does NOT auto-fix (unlike your laptop).
    - npm run format:check # Prettier in “check only” mode — wrong formatting fails the build.
    - npm run test # Vitest unit/component tests for both apps.
```

**Job 2: "E2E Tests"**

```yaml
e2e:
  name: E2E Tests
  runs-on: ubuntu-latest
  steps:
    - Checkout code
    - Setup Node.js 20
    - npm ci
    # Playwright needs a real browser binary on the runner; Chromium is installed here.
    - npx playwright install --with-deps chromium
    # Starts dev servers (per playwright.config), runs e2e/react and e2e/vue specs.
    - npm run e2e
    # If something fails, the HTML report is saved for download from the Actions tab.
    - Upload playwright-report as artifact (14-day retention)
```

**Branch protection on `main`:**

- Requires a PR (no direct pushes)
- Requires the "Lint, Format and Test" status check to pass
- No bypassing allowed

**How deployment happens:**
The CI doesn't deploy directly. Instead, Vercel is connected to the repo and auto-deploys when the PR merges to `main`. So the flow is:

1. Open PR from `develop` → `main`
2. CI runs lint, format check, tests, E2E → all must pass
3. PR can merge only if CI passes (branch protection)
4. On merge, Vercel auto-deploys

### What to show

1. Open `.github/workflows/ci.yml` in your editor — walk through both jobs.
2. Open a recent PR on GitHub — point to the green checkmarks from CI.
3. Show the branch protection settings if possible (Settings → Branches → `main`).

### What to say

> "My CI has two parallel jobs. The first runs lint, format check, and component tests. The second installs Playwright and runs E2E tests in a real Chromium browser. Both must pass before I can merge a PR. Branch protection on main enforces this — you literally can't merge if CI fails. After merge, Vercel deploys automatically."

---

## 9. Component tests that test basic components in isolation

> _My 2 apps have component tests that test my basic components in isolation._

### Where it is

**React tests:** `apps/react/src/__tests__/`
**Vue tests:** `apps/vue/src/__tests__/`

### FilterPanel tests — the main test target

Both apps have **6 identical test cases** for FilterPanel. Here's the React version (`FilterPanel.test.tsx`):

**Test 1: Renders all filter controls**

**Idea:** Prove the panel actually mounted the UI you expect — no need for a real API or map; Testing Library renders only this component into a fake DOM (`jsdom`).

```ts
it('renders all filter controls', () => {
  // Mount FilterPanel with default store state.
  render(<FilterPanel />);
  // getByRole finds accessible elements: buttons, links, etc. `name` matches visible label.
  expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Earthquakes' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Natural Events' })).toBeInTheDocument();
  // Labels are plain text nodes — good smoke test that inputs are labeled.
  expect(screen.getByText('Min Magnitude')).toBeInTheDocument();
  expect(screen.getByText('Max Magnitude')).toBeInTheDocument();
  expect(screen.getByText('Start Date')).toBeInTheDocument();
  expect(screen.getByText('End Date')).toBeInTheDocument();
  expect(screen.getByText('EONET Status')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
});
```

This verifies the component renders all its UI elements correctly in isolation.

**Test 2: Event type buttons update the store**

**Idea:** UI events should change **global** state. `useFilterStore.getState()` reads the live Zustand store outside React — perfect for assertions after `fireEvent`.

```ts
it('updates store when clicking event type buttons', () => {
  render(<FilterPanel />);
  // Simulate a user click; the component should call setEventType('earthquakes').
  fireEvent.click(screen.getByRole('button', { name: 'Earthquakes' }));
  expect(useFilterStore.getState().eventType).toBe('earthquakes');
  fireEvent.click(screen.getByRole('button', { name: 'Natural Events' }));
  expect(useFilterStore.getState().eventType).toBe('natural');
});
```

This verifies that clicking a button actually updates the global Zustand store.

**Test 3-5:** Same pattern for magnitude inputs, date inputs, and EONET status dropdown — `fireEvent.change()` the input, then check the store value.

**Test 6: Reset restores all defaults**

**Idea:** Regression test for your “escape hatch” — users should always be able to return to a known-good filter preset.

```ts
it('resets all filters to defaults', () => {
  render(<FilterPanel />);
  // Mutate state away from defaults (subset shown — your file may change more fields).
  fireEvent.click(screen.getByRole('button', { name: 'Earthquakes' }));
  // `getByDisplayValue` finds the input currently showing "2" (min magnitude default).
  fireEvent.change(screen.getByDisplayValue('2'), { target: { value: '5' } });
  // Trigger resetFilters() in the store.
  fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
  const state = useFilterStore.getState();
  expect(state.eventType).toBe('all');
  expect(state.minMagnitude).toBe(2);
  expect(state.maxMagnitude).toBe(10);
  expect(state.eonetStatus).toBe('open');
});
```

### Vue version differences

The Vue tests (`FilterPanel.test.ts`) test the same 6 cases but use:

- `mount(FilterPanel)` from `@vue/test-utils` instead of `render(<FilterPanel />)`
- `setActivePinia(createPinia())` in `beforeEach` to set up a fresh Pinia store
- `wrapper.find('button').trigger('click')` instead of `fireEvent.click()`
- `wrapper.find('input').setValue('4')` instead of `fireEvent.change()`

### Navbar tests (2 tests each)

```ts
// Smoke test: routing links exist with correct accessible names (screen readers + tests).
it('renders all 3 navigation links', () => { ... });
// Branding test: navbar shows the product name you chose (not a Vite placeholder).
it('renders the NaturalEvents brand name', () => { ... });
```

### How to run

```bash
npm run test:react   # Vitest: React only (FilterPanel + Navbar tests)
npm run test:vue     # Vitest: Vue only (same scenarios, Vue Test Utils)
npm run test         # Runs react then vue — full count = 16 tests if all pass
```

### What to show

1. Open `apps/react/src/__tests__/FilterPanel.test.tsx` — walk through the test structure
2. Open `apps/vue/src/__tests__/FilterPanel.test.ts` side by side — show they test the same things
3. Run `npm run test` in the terminal — show all 16 tests passing (8 per app)

### What to say

> "FilterPanel is the main test target because it has the most user interaction. I test 6 things: that all controls render, and that clicking buttons, changing inputs, changing the dropdown, and clicking reset all correctly update the global store. The Navbar also has basic rendering tests. Both apps have the exact same test cases — just using their framework's testing library."

---

## 10. E2E tests that test user flows with multiple components

> _My 2 apps have e2e tests that test user flows that contain multiple components working together._

### Where it is

- **Playwright config:** `playwright.config.ts` at root
- **React E2E:** `e2e/react/navigation.spec.ts` (56 lines)
- **Vue E2E:** `e2e/vue/navigation.spec.ts` (56 lines)

### How E2E differs from component tests

Component tests render a **single component** in jsdom (fake DOM). E2E tests open a **real browser** (Chromium), load the **entire app**, and interact with it like a user would — testing that **multiple components work together**.

### The 4 test cases (identical for both apps)

**Test 1: Dashboard loads with navbar and filter panel**

**Idea:** Unlike unit tests, this loads the **real app** in Chromium. You are proving the main route wires layout + navbar + filters without manually clicking everything in every demo.

```ts
test('loads the dashboard with navbar and filter panel', async ({ page }) => {
  await page.goto('/'); // Same as typing the site URL in the browser.
  await expect(page.locator('nav')).toBeVisible();
  await expect(page.getByText('NaturalEvents')).toBeVisible();
  // Router must render these links on the home page.
  await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Analytics' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  // FilterPanel buttons from the first screen — proves dashboard composition works.
  await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Earthquakes' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Natural Events' })
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
});
```

This tests **Navbar + FilterPanel + Dashboard page** all rendering together.

**Test 2: Navigate to Analytics**

**Idea:** Prove **client-side routing**: the URL updates and the Analytics view mounts. Charts may load async or show empty state, so the assertion allows multiple headings/strings.

```ts
test('navigates to analytics page', async ({ page }) => {
  await page.goto('/');
  // Real user path: click the Analytics nav link.
  await page.getByRole('link', { name: 'Analytics' }).click();
  await expect(page).toHaveURL('/analytics');
  // FilterPanel is reused on analytics — should still be visible.
  await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
  // Either the chart title, or empty copy, or loading text — all valid outcomes while data settles.
  await expect(
    page.getByText(/Magnitude Distribution|No events match|Loading analytics/)
  ).toBeVisible({ timeout: 15000 });
});
```

This tests **navigation** (click link → URL changes → new page renders) + **Analytics page** (filter panel + charts or empty state). The regex handles all three possible states (data loaded, no data, loading).

**Test 3: Navigate to About**
Tests that the About page shows all sections (heading, API info, tech stack, course info).

**Test 4: Navigate back to Dashboard from About**
Tests a full round-trip: About → click Dashboard → back on `/` with filter panel visible.

### Playwright config details

```ts
webServer: [
  {
    command: 'npm run dev:react',
    url: 'http://localhost:3000',
    // Locally: if you already ran dev servers, don’t spawn duplicates. CI: always fresh (env CI is set).
    reuseExistingServer: !process.env.CI,
  },
  {
    command: 'npm run dev:vue',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
  },
],
```

In CI, Playwright starts fresh dev servers. Locally, it reuses any already-running servers.

### How to run

```bash
npm run e2e           # runs both React and Vue E2E tests
npm run e2e -w apps/react  # React only
```

### What to show

1. Open `e2e/react/navigation.spec.ts` — walk through the test flow
2. Open `playwright.config.ts` — show the two projects and webServer config
3. Run `npm run e2e` live or show a CI run with the results

### What to say

> "E2E tests verify full user flows in a real browser. The first test checks that the dashboard loads with both the navbar and filter panel visible — that's multiple components working together. The second test clicks the Analytics link and verifies the URL changes and the page renders. These are different from component tests because they test the app as a whole, not individual components."

---

## 11. Storybook stories for basic components

> _My 2 apps have stories for my basic components using storybook._

### Where it is

**React stories** (in `apps/react/src/components/`):
| File | Stories |
|------|---------|
| `FilterPanel.stories.tsx` | Default |
| `EventMap.stories.tsx` | Default (with mock data), Empty (no events) |
| `StatsBar.stories.tsx` | Default, Empty, HighMagnitude (M8.9) |
| `Navbar.stories.tsx` | Default |
| `Layout.stories.tsx` | Default |

**Vue stories** (in `apps/vue/src/components/`):
Same 5 components, same story variants.

**Mock data** — `apps/react/src/components/__mocks__/eventData.ts`:

**Why mock data:** Storybook renders components **without** your real hooks or APIs. Fake objects let you show “busy map” or “empty stats” on demand.

```ts
// Two small quakes — useful for default map/stats appearance.
export const mockEarthquakes: EarthquakeFeature[] = [...]
// One extreme quake — tests legend scaling, big numbers in StatsBar, tsunami copy if you show it.
export const mockHighMagEarthquake: EarthquakeFeature = {...}
// EONET samples: different categories/status so marker colors and labels vary.
export const mockEonetEvents: EonetEvent[] = [...]
```

**How a story is defined** (e.g., `StatsBar.stories.tsx`):

**Storybook vocabulary:** A **story** is one saved UI state (like a preset). **`args`** are the props Storybook passes into the component for that state.

```tsx
// `meta` registers the component with Storybook (title, argTypes, decorators).
const meta: Meta<typeof StatsBar> = { component: StatsBar };
export default meta;

// Default = “normal day” with mixed earthquakes + EONET events.
export const Default: Story = {
  args: {
    earthquakes: mockEarthquakes,
    eonetEvents: mockEonetEvents,
  },
};

// Empty = verify your empty-state messaging and layout don’t break.
export const Empty: Story = {
  args: { earthquakes: [], eonetEvents: [] },
};

// HighMagnitude = stress-test formatting and emphasis for a rare huge quake.
export const HighMagnitude: Story = {
  args: { earthquakes: [mockHighMagEarthquake], eonetEvents: [] },
};
```

Each story provides different props to show the component in different states.

**Storybook config:**

- React: `apps/react/.storybook/` — runs on port 6006
- Vue: `apps/vue/.storybook/` — runs on port 6007
- Both set up necessary plugins (Pinia, Vue Router for Vue; React Router for React)

### How to run

```bash
npm run storybook:react   # Component gallery for React (port 6006)
npm run storybook:vue     # Same idea for Vue (port 6007)
```

### What to show

1. Run `npm run storybook:react` — browse the sidebar showing all 5 components
2. Click through StatsBar stories — show Default, Empty, and HighMagnitude variants
3. Show EventMap with mock data vs empty
4. Open a `.stories.tsx` file to show how it's defined

### What to say

> "Each basic component has Storybook stories. I can view them in different states — for example, StatsBar with data, without data, and with a high-magnitude earthquake. Mock data simulates realistic API responses so I can develop and test components in isolation without hitting the real API."

---

## 12. Descriptive README with screenshot, description, scripts, and live link

> _My 2 apps have a descriptive readme.md file with: a screenshot, description, how to run the project, a description of the scripts available and a link to the deployed, live website._

### Where it is

- `apps/react/README.md`
- `apps/vue/README.md`
- `README.md` (root — monorepo overview)

### What each app README contains (checklist)

| Section        |                                            React README                                             |                                     Vue README                                     |
| -------------- | :-------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------: |
| Screenshot     |                        `![Dashboard Screenshot](../../docs/screenshot.png)`                         |                `![Dashboard Screenshot](../../docs/screenshot.png)`                |
| Description    |                    "An interactive dashboard that visualizes earthquake data..."                    |                                        Same                                        |
| Live site link |                              `https://natural-events-react.vercel.app`                              |                      `https://natural-events-vue.vercel.app`                       |
| How to run     |                          `npm install` + `npm run dev:react` on port 3000                           |                   `npm install` + `npm run dev:vue` on port 3001                   |
| Scripts table  | 10 scripts (dev, build, preview, test, lint, format, format:check, e2e, storybook, build-storybook) |                                  Same 10 scripts                                   |
| Tech stack     |         React 19, Zustand, react-leaflet, Recharts, Tailwind, Vitest, Playwright, Storybook         | Vue 3.5, Pinia, @vue-leaflet, vue-chartjs, Tailwind, Vitest, Playwright, Storybook |
| API references |                                    USGS + NASA EONET with links                                     |                                        Same                                        |

### What to show

- Open `apps/react/README.md` on GitHub (rendered Markdown) — scroll through sections
- Point out: screenshot, live link, scripts table

### What to say

> "Both apps have descriptive READMEs with a screenshot, a description of what the app does, instructions on how to run it, a complete scripts table, and links to the live deployed site."

---

## 13. No dead code, boilerplate, or unused assets

> _My 2 apps have no dead code, old counter example code or boilerplate code from the init command. Also remove unused assets._

### How to prove it

1. **No Vite boilerplate:** No `App.css` with template styles, no `logo.svg`, no counter component, no `assets/react.svg`.
2. **Every file has a purpose:**
   - `src/pages/` — 4 page components
   - `src/components/` — 5 functional components + 5 story files + 1 mock data file
   - `src/hooks/` or `src/composables/` — 2 data-fetching hooks
   - `src/services/` — 2 API service files
   - `src/store/` or `src/stores/` — 1 filter store
   - `src/__tests__/` — 2 test files
3. **No commented-out code:** You can scroll through any file and there are no commented-out blocks.
4. **Lint enforces it:** ESLint has `@typescript-eslint/no-unused-vars: warn` — any unused imports or variables show up in lint.
5. **TypeScript enforces it:** Vue's `tsconfig.json` has `noUnusedLocals` and `noUnusedParameters` enabled.

### What to show

- Browse `apps/react/src/` in the file tree — show there's no junk
- Run `npm run lint` — clean output, no warnings about unused code

### What to say

> "I removed all Vite boilerplate — no default counter, no template logos, no sample CSS. Every file in the project serves a purpose. ESLint flags unused variables, and TypeScript strict mode catches unused locals."

---

## 14. Both apps match visually and in what is being tested

> _My 2 apps match exactly visually and in regards to what is being tested._

### Visual match — how

Both apps use **the exact same Tailwind CSS classes**. Since Tailwind is utility-first (classes like `rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100`), using the same class names produces identical visual output regardless of framework.

Examples of matching classes:

- FilterPanel container: `rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100`
- Active toggle button: `bg-indigo-600 text-white shadow-sm`
- Stats cards: `rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-100`
- Map container: `h-[500px] w-full overflow-hidden rounded-xl shadow-sm ring-1 ring-gray-100`

### Test match — what

| Test file      |             React              |             Vue              | Test count |
| -------------- | :----------------------------: | :--------------------------: | :--------: |
| FilterPanel    |     `FilterPanel.test.tsx`     |    `FilterPanel.test.ts`     |   6 each   |
| Navbar         |       `Navbar.test.tsx`        |     `AppNavbar.test.ts`      |   2 each   |
| E2E Navigation | `e2e/react/navigation.spec.ts` | `e2e/vue/navigation.spec.ts` |   4 each   |
| Storybook      |    5 components, 9 stories     |   5 components, 9 stories    |    Same    |

The E2E test files are **literally the same code** except for the describe block name ("React App Navigation" vs "Vue App Navigation").

### What to show

- Open both live apps side by side in the browser — visually identical
- Open `apps/react/src/__tests__/FilterPanel.test.tsx` and `apps/vue/src/__tests__/FilterPanel.test.ts` side by side — same 6 test cases
- Open `e2e/react/navigation.spec.ts` and `e2e/vue/navigation.spec.ts` side by side — identical test logic

### What to say

> "Both apps look identical because they use the same Tailwind CSS classes. And they're tested identically — same 6 FilterPanel tests, same 2 Navbar tests, same 4 E2E navigation tests, same Storybook stories. The only differences are framework-specific: React Testing Library vs Vue Test Utils, useEffect vs watch, Zustand vs Pinia."

---

## 15. Descriptive titles and names

> _My 2 apps have descriptive titles, and names. Nothing like "my app", "front-end-frameworks app", "test app"._

### Where it is

| What                  | Name                                                     |
| --------------------- | -------------------------------------------------------- |
| App brand (in navbar) | **NaturalEvents**                                        |
| Root package name     | `terrawatch`                                             |
| React Vercel URL      | `natural-events-react.vercel.app`                        |
| Vue Vercel URL        | `natural-events-vue.vercel.app`                          |
| Browser tab title     | Set in `apps/react/index.html` and `apps/vue/index.html` |
| About page heading    | "About NaturalEvents"                                    |

### What to show

- Point to the "NaturalEvents" brand in the top-left of the navbar.
- Point to the browser tab title.

### What to say

> "The app is called NaturalEvents — it's a descriptive name for a dashboard that monitors earthquakes and natural events. The Vercel URLs, page titles, and navbar all use this name. No generic names anywhere."

---

## 16. Comfortable answering questions and explaining engineering decisions

> _I am comfortable answering questions about my project and explaining my engineering decisions._

### Key decisions to be ready to explain

---

**Q: Why a monorepo instead of two separate repos?**

> "I used a monorepo with npm workspaces so both apps can share TypeScript types and API constants from `packages/shared/`. If I change a type or URL, both apps get the update immediately. It also means one CI pipeline, one Playwright config, one ESLint config, and one Prettier config instead of duplicating everything."

---

**Q: Why Zustand for React and Pinia for Vue?**

> "Zustand is the most popular lightweight state manager for React — it's much simpler than Redux. Pinia is the official state library for Vue 3, it replaced Vuex. Both follow a similar pattern: define state and actions in a store, access it from any component."

React (Zustand) — `apps/react/src/store/filterStore.ts`:

**How to read Zustand:** `create` returns a **hook** `useFilterStore`. The object holds **state** (plain values) and **actions** (functions that call `set` to replace part of the state). Anything in the store is readable from any component.

```ts
export const useFilterStore = create<FilterState>((set) => ({
  // --- State fields (what the UI reads) ---
  eventType: 'all',
  minMagnitude: 2,
  maxMagnitude: 10,
  ...getDefaultDates(), // helper that fills start/end date defaults (e.g. last 30 days)
  eonetStatus: 'open',
  // --- Actions (what the UI calls when user interacts) ---
  setEventType: (eventType) => set({ eventType }), // merge-update: only eventType changes
  resetFilters: () => set({ eventType: 'all', minMagnitude: 2, ... }),
}));
```

Vue (Pinia) — `apps/vue/src/stores/filterStore.ts`:

**How to read Pinia “setup store”:** `ref` makes values reactive. You **return** refs and functions from the factory — Pinia exposes them on `useFilterStore()`. Same pattern as Zustand: central state + methods.

```ts
export const useFilterStore = defineStore('filter', () => {
  // `ref` wraps a primitive/object in a reactive container (.value in script).
  const eventType = ref<'all' | 'earthquakes' | 'natural'>('all');
  const minMagnitude = ref(2);
  // ... maxMagnitude, dates, eonetStatus, setters ...
  function resetFilters() {
    eventType.value = 'all';
    minMagnitude.value = 2;
    // ...restore other defaults...
  }
  // Everything returned is public on the store instance.
  return { eventType, minMagnitude, ..., resetFilters };
});
```

---

**Q: Why Leaflet for maps?**

> "Leaflet is free, open-source, and doesn't need an API key — unlike Google Maps or Mapbox. Both `react-leaflet` and `@vue-leaflet/vue-leaflet` are mature wrappers. For a university project, not needing API keys is a big advantage."

---

**Q: Why Recharts for React and vue-chartjs for Vue?**

> "Recharts is the most popular React charting library — it uses React components so it feels natural. For Vue, vue-chartjs wraps Chart.js with Vue components. I used the most idiomatic option for each framework rather than forcing the same library on both."

---

**Q: Why Axios instead of fetch?**

> "Axios has cleaner syntax for query parameters — you pass them as an object and it handles URL encoding. It also auto-parses JSON responses. With fetch, I'd need to manually append query strings and call `.json()` on every response."

---

**Q: Why put filters in a global store instead of component state?**

> "Filters are used by the dashboard (map + stats bar), the analytics page (charts), and the data-fetching hooks/composables. If I kept them in component state, I'd need to pass them as props through multiple levels (prop drilling) and they'd reset when navigating between pages. A global store persists filters across page navigation."

---

**Q: How does the data flow work end-to-end?**

**One sentence version:** “Filters live in one global store; hooks listen to those values, fetch from the API when they change, and whatever component uses the hook gets fresh data and redraws.”

> 1. User changes a filter in FilterPanel → store updates immediately (e.g., `setMinMagnitude(5)`)
> 2. The `useEarthquakes` hook reads those store values. When they change, `useEffect` (React) / `watch` (Vue) runs again.
> 3. The hook calls `fetchEarthquakes()` with the new params → Axios GET to USGS API (same idea for EONET in its composable).
> 4. API returns GeoJSON → hook updates its **local** `data` state (this is separate from the store: store = filters, hook state = current result list).
> 5. Components that use the hook (Dashboard, Analytics) **re-render** because their data changed.
> 6. Map shows updated markers, StatsBar shows updated counts, charts show updated distributions.

**Memory aid if you draw on a whiteboard:** `FilterPanel → store → hook → service → API → hook state → Map / StatsBar / Charts`.

---

**Q: How do the map marker colors work?**

Earthquake markers — color by depth (`EventMap.tsx` lines 11-16):

**Presentation line:** “Depth is how far underground the quake started; I use a simple stepped scale so shallow shakes ‘feel’ hotter and deep ones cooler.”

```ts
function getDepthColor(depth: number) {
  if (depth < 30) return '#f97316'; // shallow — warm orange
  if (depth < 100) return '#eab308'; // mid — yellow
  if (depth < 300) return '#22c55e'; // deeper — green
  return '#3b82f6'; // very deep — blue
}
```

Size by magnitude: `radius = Math.max(mag * 3, 4)` — **stronger quakes get a larger circle** (magnitude is “how big”), with a **minimum radius of 4** so tiny quakes are still clickable.

EONET markers — color by category (`EventMap.tsx` lines 18-27):

**Presentation line:** “Natural events aren’t ‘magnitude,’ so I bucket by NASA category id and map each to a color — users spot fires vs storms instantly.”

```ts
const colors: Record<string, string> = {
  wildfires: '#ef4444', // red — fire
  severeStorms: '#8b5cf6', // purple — storm systems
  volcanoes: '#f97316', // orange — volcanic activity
  seaLakeIce: '#06b6d4', // cyan — ice / water features
  snow: '#06b6d4', // cyan — winter weather (same family visually)
};
```

Fixed **8px radius** for EONET markers (you are not encoding intensity the same way as USGS magnitude).

---

**Q: Why lazy-load the map component?**

> "Leaflet is a heavy library (~40KB gzipped). By lazy-loading it with `React.lazy()` / `defineAsyncComponent()`, the map code isn't included in the initial bundle. The app loads faster, and the map loads asynchronously with a 'Loading map...' placeholder. This also avoids SSR issues since Leaflet accesses `window` directly."

---

**Q: What are the two APIs you use?**

> "USGS Earthquake API — it's the US Geological Survey's real-time earthquake feed. I query it with filters (magnitude range, date range) and it returns GeoJSON with earthquake features including magnitude, depth, location, felt reports, and tsunami status."
>
> "NASA EONET v3 — Earth Observatory Natural Event Tracker. It tracks ongoing natural events like wildfires, storms, volcanoes, and sea ice. I can filter by status (open/closed). Each event has a title, category, coordinates, and source links."
>
> "Both are free and don't require API keys."

---

**Q: How does the Event Detail page know if it's an earthquake or EONET event?**

> "It checks the ID format. EONET event IDs start with `EONET_` (e.g., `EONET_6744`). Earthquake IDs are alphanumeric (e.g., `us7000n1a5`). The code is just: `const isEonet = id?.startsWith('EONET_')`. Then it calls the appropriate API."

From `EventDetail.tsx` (line 11):

**Why this works:** Your app encodes EONET ids with an **`EONET_` prefix** when building links from NASA EONET feature ids, while USGS ids look like `us7000n1a5`. One `startsWith` check routes to the correct fetcher.

```ts
// Optional chaining: if `id` were undefined, this safely yields false instead of throwing.
const isEonet = id?.startsWith('EONET_');
```

---

## Quick Demo Script (suggested presentation order)

Use this as a **checklist**, not a script to read word-for-word. Between steps, breathe: say what you are doing (“now I’ll change the filter and you should see the map refresh”) so the audience follows the cause and effect.

1. **Open both live apps** (React + Vue) side by side — show they look identical
2. **Dashboard tour:** point out the map, colored markers, stats bar
3. **Click a marker** → show the popup → click "View details" → event detail page → "Back to Dashboard"
4. **Filter interaction:** toggle event type, change magnitude range, change dates — watch map update
5. **Click "Reset"** — everything reverts
6. **Analytics page:** show the bar chart (magnitude distribution) and line chart (events over time)
7. **About page:** quick glance at API credits and tech stack
8. **Code walkthrough:**
   - `packages/shared/constants.ts` — centralized API URLs
   - `apps/react/src/services/usgs.ts` — Axios service call
   - `apps/react/src/hooks/useEarthquakes.ts` — data flow from store → API → components
   - `apps/react/src/store/filterStore.ts` — Zustand store
   - Show Vue equivalents briefly (composable + Pinia store)
9. **Tests:** run `npm run test` in terminal — show all passing
10. **CI:** open `.github/workflows/ci.yml` + show a green PR on GitHub
11. **E2E:** open `e2e/react/navigation.spec.ts` — explain the 4 tests
12. **Storybook:** run `npm run storybook:react` — browse components
13. **READMEs:** show on GitHub (rendered markdown)

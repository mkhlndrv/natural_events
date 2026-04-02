# Presentation Guide — Criteria Walkthrough

This guide helps you present and explain each grading criteria. It's written in normal language so you can confidently talk about what you built even if you're newer to web development.

**Quick glossary**

- **Monorepo** = One project folder containing multiple apps. You install everything once and the apps can share code.
- **Service** = A helper file that talks to an online API — builds the URL, makes the request, gives back data.
- **Hook (React) / Composable (Vue)** = Reusable logic that calls the service and tracks loading/error/data state.
- **Store** = A shared "brain" for the app where you keep data that multiple pages need (like filter settings).

---

## 1. Two apps in two different front-end frameworks

> _I have 2 repos of the same app in 2 different front-end frameworks that are either React, Vue, Svelte, Solid or Angular._

### Presenter script

> "For this criteria, I built the same app twice — once in **React** and once in **Vue**, which are two different front-end frameworks. They both live inside one project folder, which is called a **monorepo**. I set it up using **npm workspaces** — that basically means I install everything once at the top level, and both apps can share code from a shared package called `packages/shared`. That shared package has things like API URLs and TypeScript types, so if I change something there, both apps pick it up automatically. I don't have to update things in two places."

### What to show

- Open the project root in your editor — show the `apps/react/` and `apps/vue/` folders side by side.
- Open root `package.json` and point to the `"workspaces"` field.
- Open `packages/shared/index.ts` to show what's being shared.

### Details

Both apps are in a single folder. The root `package.json` declares:

```json
"workspaces": [
  "apps/*",
  "packages/*"
]
```

This tells npm to link everything together. One `npm install` at the root sets up React, Vue, and the shared library. Both apps import shared types and API constants using the name `@terrawatch/shared`.

- **React app:** `apps/react/` — React 19 + React Router + Zustand + Recharts + react-leaflet
- **Vue app:** `apps/vue/` — Vue 3.5 + Vue Router + Pinia + vue-chartjs + @vue-leaflet

---

## 2. Not using templates or pre-built apps

> _I am not using templates or pre-built apps._

### Presenter script

> "I didn't use any pre-made dashboard template or starter kit. I started with **Vite**, which just gives you a completely empty project — no design, no components, nothing. Then I built everything from scratch myself: the pages, the routing, the navigation, the map, the charts, the filters, the API calls, the state management — all of it. If you look through the source code, every single file is something I created for this project. There's no leftover demo code or template logos."

### What to show

- Browse through `apps/react/src/` — point out that every file is your own work.
- If asked, show git log: "You can see from the commits that each component was added step by step."

### Details

- Started from `npm create vite@latest` — gives you an empty `App.tsx`/`App.vue` and nothing else.
- No leftover boilerplate — no default counter, no template logos, no sample CSS.
- Custom-built: 5 components, 4 pages, 2 services, 2 hooks/composables, 1 store.

---

## 3. Apps fetch data from an API and do something with it

> _My 2 apps fetch data from an api and do something with that data._

### Presenter script

> "Both apps pull real data from two free public APIs. The first one is the **USGS API** — that's the U.S. Geological Survey — which gives us real-time earthquake data. The second is **NASA's EONET API**, which tracks natural events like wildfires, storms, and volcanoes. All the API URLs are stored in one shared file called `constants.ts` so nothing is scattered around — if an API URL ever changes, I only update it in one place. The way it works is: I have **service** files that make the actual API requests, and then **hooks** in React or **composables** in Vue that sit in the middle — they read the current filter settings, call the service, and keep track of whether data is loading, if there's an error, or if the data is ready. When a user changes a filter, the hook automatically re-fetches from the API. That data drives everything in the app: the map markers, the stats bar, the analytics charts, and the event detail pages."

### What to show

1. Open `packages/shared/constants.ts` — show the centralized URLs.
2. Open `apps/react/src/services/usgs.ts` — show the `fetchEarthquakes()` call.
3. Open `apps/react/src/hooks/useEarthquakes.ts` — show how it auto-re-fetches when filters change.
4. Open the live app dashboard — change a filter and watch the data refresh.

### Details

**API URLs** — all in one place at `packages/shared/constants.ts`:

```ts
// USGS = U.S. Geological Survey earthquake API
export const USGS_QUERY_URL =
  'https://earthquake.usgs.gov/fdsnws/event/1/query';
export const USGS_FEED_URL =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';
// EONET = NASA "natural events" API (fires, storms, volcanoes, etc.)
export const EONET_EVENTS_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events';
export const EONET_CATEGORIES_URL =
  'https://eonet.gsfc.nasa.gov/api/v3/categories';
```

**Service files** — the code that actually calls the APIs:

```ts
// This function talks to the USGS earthquake API
export async function fetchEarthquakes(
  params: UsgsParams
): Promise<EarthquakeFeatureCollection> {
  // Send a GET request with the user's filter settings
  const response = await axios.get(USGS_QUERY_URL, {
    params: { format: 'geojson', ...params },
  });
  // Axios parses the JSON for us automatically
  return response.data;
}
```

**Hooks/Composables** — sit between services and components:

React version:

```ts
export function useEarthquakes() {
  // Read what the user has set in the filters
  const { minMagnitude, maxMagnitude, startDate, endDate } = useFilterStore();
  const [data, setData] = useState<EarthquakeFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This runs automatically whenever any filter value changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchEarthquakes({
      starttime: startDate,
      endtime: endDate,
      minmagnitude: minMagnitude,
      maxmagnitude: maxMagnitude,
    })
      .then((response) => setData(response.features))
      .catch((err) => {
        setError(err.message);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [minMagnitude, maxMagnitude, startDate, endDate]);
  // ☝️ This list tells React: "re-run this whenever any of these change"

  return { data, loading, error };
}
```

Vue uses `watch` instead of `useEffect` — same idea, different syntax.

**What the data is used for:**

1. **Dashboard map** — markers sized by magnitude, colored by depth
2. **Stats bar** — earthquake count, event count, strongest quake
3. **Analytics charts** — magnitude distribution, events over time
4. **Event detail page** — full event info

---

## 4. User interaction (click to navigate, click to expand)

> _My 2 apps have user interaction (click to navigate, click to expand)._

### Presenter script

> "There's user interaction on every page. You can **click the navigation links** to go between Dashboard, Analytics, and About — the active page is highlighted. On the map, **clicking a marker opens a popup** with a summary of that event — that's the 'expand' part. Inside the popup there's a **'View details' link** that takes you to a full detail page. From there you can click **'Back to Dashboard'** to go back. The **filter panel** is fully interactive: you can toggle between event types, change magnitude ranges, pick date ranges, filter by status, and hit Reset to go back to defaults. Because all filters are stored in a global store, changing them updates the map, stats bar, and charts all at the same time. I can demo all of this live."

### What to show (live demo)

1. Click through navbar links — watch the active state change
2. On the dashboard, click a map marker — show the popup expanding
3. Click "View details" in the popup — navigate to the detail page
4. Click "← Back to Dashboard" — navigate back
5. Change the event type toggle to "Earthquakes" — watch EONET markers disappear
6. Change min magnitude to 5 — watch small markers disappear
7. Change a date — watch data reload
8. Click "Reset" — everything goes back to normal

### Details

| What                  | Where                                 | What happens                                  |
| --------------------- | ------------------------------------- | --------------------------------------------- |
| Navbar links          | `Navbar.tsx` / `AppNavbar.vue`        | Click to navigate between pages               |
| Map marker click      | `EventMap.tsx` / `EventMap.vue`       | Opens popup with event summary                |
| "View details" link   | Inside map popups                     | Goes to full detail page                      |
| "Back to Dashboard"   | `EventDetail.tsx` / `EventDetail.vue` | Returns to main page                          |
| Event type toggles    | `FilterPanel.tsx` / `FilterPanel.vue` | Filters by All / Earthquakes / Natural Events |
| Magnitude inputs      | `FilterPanel.tsx` / `FilterPanel.vue` | Sets min/max magnitude                        |
| Date pickers          | `FilterPanel.tsx` / `FilterPanel.vue` | Narrows time range                            |
| EONET status dropdown | `FilterPanel.tsx` / `FilterPanel.vue` | Filters by All / Open / Closed                |
| Reset button          | `FilterPanel.tsx` / `FilterPanel.vue` | Resets everything to defaults                 |

---

## 5. Package.json scripts for lint, format, test, and e2e

> _My 2 apps have scripts in their package.json files to: lint (eslint), format (prettier), component test (vitest) and e2e test (playwright) the codebase._

### Presenter script

> "Both apps have all the required scripts set up in their `package.json` files. There's `lint` which uses **ESLint** to check for code quality issues, `format` which uses **Prettier** to keep the code style consistent, `test` which runs component tests with **Vitest**, and `e2e` which runs end-to-end tests with **Playwright** in a real browser. There's also a `format:check` mode that just checks formatting without changing anything — that's what CI uses. On top of that, I set up convenience scripts at the root level so I can run lint, format, or tests for **both apps at once** with a single command. The Playwright config has two projects — React on port 3000, Vue on 3001 — and it automatically starts both dev servers before the tests run."

### What to show

- Open `apps/react/package.json` and scroll to the `scripts` section.
- Run `npm run lint` from root — show it passes.
- Run `npm run test` — show Vitest output for both apps.

### Details

**Per-app scripts** (both React and Vue have these):
| Script | What it does | Tool |
|--------|-------------|------|
| `lint` | Checks code for errors/issues | ESLint |
| `format` | Auto-fixes code formatting | Prettier |
| `format:check` | Checks formatting without changing anything | Prettier |
| `test` | Runs component tests | Vitest |
| `e2e` | Runs browser-based tests | Playwright |
| `storybook` | Opens the component gallery | Storybook |

**Root scripts** (run both apps at once):
| Script | What it does |
|--------|-------------|
| `npm run lint` | Lints both apps |
| `npm run format` | Formats both apps |
| `npm run test` | Runs component tests for both apps |
| `npm run e2e` | Runs E2E tests for both apps |

**Playwright config** (`playwright.config.ts`):

```ts
projects: [
  { name: 'react', testDir: './e2e/react', use: { baseURL: 'http://localhost:3000' } },
  { name: 'vue', testDir: './e2e/vue', use: { baseURL: 'http://localhost:3001' } },
],
webServer: [
  { command: 'npm run dev:react', url: 'http://localhost:3000' },
  { command: 'npm run dev:vue', url: 'http://localhost:3001' },
],
```

---

## 6. Properly linted, formatted, and all tests pass

> _My 2 apps are properly linted, formatted and pass all tests._

### Presenter script

> "The codebase passes all lint checks and formatting rules. I set up **ESLint** and **Prettier** at the root level so both apps share the same rules — everything is consistent. I also set up a tool called **Husky** that runs automatically before every git commit. It checks your code with ESLint and formats it with Prettier before the commit goes through — so it's literally impossible to commit code that doesn't pass. ESLint catches things like unused variables, and Prettier makes sure all the spacing and formatting is consistent. I can run `npm run lint` and `npm run format:check` from the root and both apps pass clean. Vitest component tests also pass for both apps."

### What to show

1. Run `npm run lint` — should exit with 0 (no errors).
2. Run `npm run format:check` — should exit with 0.
3. Run `npm run test` — should see **16** tests total (8 per app).

### Details

**ESLint config** — `.eslintrc.cjs`:

```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
```

**Prettier config** — `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

**Git hooks** — `.husky/pre-commit` runs `npx lint-staged`, which auto-lints and formats staged files before every commit.

---

## 7. Connected to Vercel for automated deployments

> _My 2 apps are connected to vercel (or similar) for automated deployments._

### Presenter script

> "Both apps are deployed on **Vercel** as separate projects from the same GitHub repo. Each project is pointed at its own app folder — React at `apps/react`, Vue at `apps/vue`. When code gets pushed to the main branch, Vercel automatically builds and deploys both apps. Pull requests also get **preview URLs** so you can test changes before merging. Here are the live links — React and Vue — same features, different framework."

### What to show

- Open both live URLs in browser tabs — show them working.
- Optionally show the Vercel dashboard for deployment history.

### Details

- **React live URL:** https://natural-events-react.vercel.app
- **Vue live URL:** https://natural-events-vue.vercel.app
- Both are separate Vercel projects connected to the same GitHub monorepo.
- Vercel auto-detects Vite, runs `npm run build`, and serves the output.
- Every push to `main` triggers a new deployment. Every PR gets a preview URL.

---

## 8. GitHub workflow for CI (lint, format, test, e2e on PR)

> _My 2 apps have a github workflow that, on each pull request to main, will run lint check, format check, component test and e2e test. If those pass, it will deploy it to vercel (or similar)._

### Presenter script

> "I set up a CI pipeline using **GitHub Actions**. It's a YAML file called `ci.yml` that runs automatically whenever someone opens a pull request to the main branch. It has **two jobs that run at the same time**: the first one does lint checking, format checking, and runs all the component tests. The second one installs a real Chromium browser and runs the end-to-end tests. Both jobs have to pass before the PR can be merged — I set up **branch protection** on main so you literally can't merge if the checks fail. The CI doesn't deploy directly — instead, **Vercel** watches the repo and deploys automatically when changes land on main after a successful merge."

### What to show

1. Open `.github/workflows/ci.yml` in your editor — walk through both jobs.
2. Open a recent PR on GitHub — point to the green checkmarks from CI.
3. Show the branch protection settings if possible.

### Details

**Job 1: "Lint, Format and Test":**

```yaml
ci:
  name: Lint, Format and Test
  runs-on: ubuntu-latest
  steps:
    - Checkout code
    - Setup Node.js 20
    - npm ci
    - npm run lint
    - npm run format:check
    - npm run test
```

**Job 2: "E2E Tests"** (runs in parallel):

```yaml
e2e:
  name: E2E Tests
  runs-on: ubuntu-latest
  steps:
    - Checkout code
    - Setup Node.js 20
    - npm ci
    - npx playwright install --with-deps chromium
    - npm run e2e
    - Upload test report as artifact
```

**The full flow:** Open PR → CI runs → must pass → merge → Vercel auto-deploys.

---

## 9. Component tests that test basic components in isolation

> _My 2 apps have component tests that test my basic components in isolation._

### Presenter script

> "I wrote component tests using **Vitest** that test individual components by themselves — no real browser, no real API, just the component in isolation. The main test target is the **FilterPanel** because it has the most user interaction. I test six things: that all the controls show up on screen, that clicking the event type buttons updates the global store correctly, that changing magnitude inputs works, that changing date inputs works, that the dropdown works, and that the Reset button puts everything back to defaults. I also test the **Navbar** to make sure all the links and the brand name show up. Both apps have the exact same tests — 8 tests each, 16 total — just using their framework's testing tools. React uses Testing Library, Vue uses Vue Test Utils with a fresh Pinia store per test."

### What to show

1. Open a test file — walk through the structure.
2. Run `npm run test` in the terminal — show all 16 tests passing.

### Details

**React tests:** `apps/react/src/__tests__/`
**Vue tests:** `apps/vue/src/__tests__/`

**Test 1: All controls show up**

```ts
it('renders all filter controls', () => {
  render(<FilterPanel />);
  expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Earthquakes' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Natural Events' })).toBeInTheDocument();
  expect(screen.getByText('Min Magnitude')).toBeInTheDocument();
  expect(screen.getByText('Max Magnitude')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
});
```

**Test 2: Clicking buttons updates the store**

```ts
it('updates store when clicking event type buttons', () => {
  render(<FilterPanel />);
  fireEvent.click(screen.getByRole('button', { name: 'Earthquakes' }));
  expect(useFilterStore.getState().eventType).toBe('earthquakes');
});
```

**Tests 3-5:** Same pattern for magnitude inputs, date inputs, and EONET dropdown.

**Test 6: Reset puts everything back to defaults**

```ts
it('resets all filters to defaults', () => {
  render(<FilterPanel />);
  fireEvent.click(screen.getByRole('button', { name: 'Earthquakes' }));
  fireEvent.change(screen.getByDisplayValue('2'), { target: { value: '5' } });
  fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
  const state = useFilterStore.getState();
  expect(state.eventType).toBe('all');
  expect(state.minMagnitude).toBe(2);
});
```

**Navbar tests (2 each):** Check that all 3 nav links show up, and that "NaturalEvents" brand is displayed.

```bash
npm run test    # Runs both apps — 16 tests total
```

---

## 10. E2E tests that test user flows with multiple components

> _My 2 apps have e2e tests that test user flows that contain multiple components working together._

### Presenter script

> "E2E tests are different from component tests. Component tests check one piece by itself. **End-to-end tests** open a **real browser** — Chromium — and interact with the full app like a real user would. I have four E2E tests: the first checks that the dashboard loads with the navbar and filter panel all visible together — that's multiple components working as one. The second clicks the Analytics link, checks that the URL changes, and makes sure the page shows up. The third does the same for the About page. And the fourth navigates back to the dashboard to test the full round trip. These tests prove that routing, layout, and multiple components all work together — not just individually. The Playwright config starts both dev servers automatically before running the tests."

### What to show

1. Open `e2e/react/navigation.spec.ts` — walk through the test flow.
2. Open `playwright.config.ts` — show the two projects and webServer config.
3. Run `npm run e2e` or show a CI run with the results.

### Details

- **React E2E:** `e2e/react/navigation.spec.ts`
- **Vue E2E:** `e2e/vue/navigation.spec.ts`

**Test 1: Dashboard loads with navbar and filter panel**

```ts
test('loads the dashboard with navbar and filter panel', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav')).toBeVisible();
  await expect(page.getByText('NaturalEvents')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Analytics' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
});
```

**Test 2: Navigate to Analytics**

```ts
test('navigates to analytics page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Analytics' }).click();
  await expect(page).toHaveURL('/analytics');
  await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
  await expect(
    page.getByText(/Magnitude Distribution|No events match|Loading analytics/)
  ).toBeVisible({ timeout: 15000 });
});
```

**Test 3:** Navigate to About — checks all sections show up.
**Test 4:** Navigate back to Dashboard from About — tests round trip.

```bash
npm run e2e    # Runs both React and Vue E2E tests
```

---

## 11. Storybook stories for basic components

> _My 2 apps have stories for my basic components using storybook._

### Presenter script

> "I set up **Storybook** for both apps. Storybook is basically a catalog where you can browse each component by itself, outside of the full app. Each of the five main components has a stories file. I use **mock data** — fake earthquake and event data — so I can show components in different states without hitting the real API. For example, StatsBar has a 'Default' story with normal data, an 'Empty' story with no data, and a 'HighMagnitude' story that shows what a really big earthquake looks like. Both apps have the same stories — React runs on port 6006, Vue on port 6007."

### What to show

1. Run `npm run storybook:react` — browse the sidebar showing all 5 components.
2. Click through StatsBar stories — show Default, Empty, HighMagnitude.
3. Open a `.stories.tsx` file to show how it's defined.

### Details

**Stories per component:**
| Component | Stories |
|-----------|---------|
| FilterPanel | Default |
| EventMap | Default (with mock data), Empty |
| StatsBar | Default, Empty, HighMagnitude (M8.9) |
| Navbar | Default |
| Layout | Default |

Same for both React and Vue.

**Example story** (`StatsBar.stories.tsx`):

```tsx
const meta: Meta<typeof StatsBar> = { component: StatsBar };
export default meta;

export const Default: Story = {
  args: { earthquakes: mockEarthquakes, eonetEvents: mockEonetEvents },
};
export const Empty: Story = {
  args: { earthquakes: [], eonetEvents: [] },
};
export const HighMagnitude: Story = {
  args: { earthquakes: [mockHighMagEarthquake], eonetEvents: [] },
};
```

```bash
npm run storybook:react   # Port 6006
npm run storybook:vue     # Port 6007
```

---

## 12. Descriptive README with screenshot, description, scripts, and live link

> _My 2 apps have a descriptive readme.md file with: a screenshot, description, how to run the project, a description of the scripts available and a link to the deployed, live website._

### Presenter script

> "Both apps have detailed README files. Each one has a **screenshot** of the dashboard, a **description** of what the app does, **step-by-step instructions** on how to install and run it, a **table listing all the npm scripts**, the **tech stack**, **API credits** with links, and a direct link to the **live deployed site**. There's also a root README for the monorepo overview. Anyone who opens the repo on GitHub gets everything they need in one place."

### What to show

- Open `apps/react/README.md` on GitHub (rendered Markdown) — scroll through sections.
- Point out: screenshot, live link, scripts table.

### Details

- `apps/react/README.md`
- `apps/vue/README.md`
- `README.md` (root — monorepo overview)

| Section        | ✅ React                            | ✅ Vue                            |
| -------------- | ----------------------------------- | --------------------------------- |
| Screenshot     | Yes                                 | Yes                               |
| Description    | Yes                                 | Yes                               |
| Live site link | `natural-events-react.vercel.app`   | `natural-events-vue.vercel.app`   |
| How to run     | `npm install` + `npm run dev:react` | `npm install` + `npm run dev:vue` |
| Scripts table  | 10 scripts                          | 10 scripts                        |
| Tech stack     | Yes                                 | Yes                               |
| API references | USGS + NASA EONET                   | Same                              |

---

## 13. No dead code, boilerplate, or unused assets

> _My 2 apps have no dead code, old counter example code or boilerplate code from the init command. Also remove unused assets._

### Presenter script

> "I cleaned up everything that came with the Vite starter. There's no leftover counter demo, no template logos, no sample CSS — none of that. Every file in the project serves a real purpose: pages, components, services, store, tests, and stories. ESLint is set up to warn about unused variables, and TypeScript in strict mode catches unused code too. If I run `npm run lint`, there are no warnings about leftover junk."

### What to show

- Browse `apps/react/src/` in the file tree — show there's no junk.
- Run `npm run lint` — clean output.

### Details

1. No Vite boilerplate — no default logos, no counter, no template CSS.
2. Every file maps to a feature: pages, components, hooks, services, store, tests.
3. No commented-out code blocks anywhere.
4. ESLint has `@typescript-eslint/no-unused-vars: warn`.
5. Vue's `tsconfig.json` has `noUnusedLocals` and `noUnusedParameters`.

---

## 14. Both apps match visually and in what is being tested

> _My 2 apps match exactly visually and in regards to what is being tested._

### Presenter script

> "Side by side in the browser, both apps look identical — I used the exact same **Tailwind CSS** classes in both. Since Tailwind works with utility classes like `bg-white`, `rounded-xl`, `shadow-sm`, using the same class names in React and Vue produces the same visual result. And the testing is parallel too: same 6 FilterPanel tests, same 2 Navbar tests, same 4 E2E tests, same Storybook stories. The only differences are framework-specific things like React hooks versus Vue composables, or Zustand versus Pinia — not different product behavior."

### What to show

- Open both live apps side by side in the browser — visually identical.
- Open test files side by side — same test cases.

### Details

**Visual match** — same Tailwind classes, e.g.:

- FilterPanel: `rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100`
- Active button: `bg-indigo-600 text-white shadow-sm`

**Test match:**
| Test area | React | Vue | Count |
|-----------|-------|-----|-------|
| FilterPanel | `FilterPanel.test.tsx` | `FilterPanel.test.ts` | 6 each |
| Navbar | `Navbar.test.tsx` | `AppNavbar.test.ts` | 2 each |
| E2E | `e2e/react/navigation.spec.ts` | `e2e/vue/navigation.spec.ts` | 4 each |
| Storybook | 5 components, 9 stories | 5 components, 9 stories | Same |

---

## 15. Descriptive titles and names

> _My 2 apps have descriptive titles, and names. Nothing like "my app", "front-end-frameworks app", "test app"._

### Presenter script

> "The app is called **NaturalEvents** — it's a clear, descriptive name for what it does: monitoring earthquakes and natural events on a map. You can see the name in the navbar, the browser tab title, the About page, and the Vercel URLs. There are no generic names like 'my app' or 'test project' anywhere."

### What to show

- Point to the "NaturalEvents" brand in the navbar.
- Point to the browser tab title.

### Details

| What               | Name                              |
| ------------------ | --------------------------------- |
| App brand (navbar) | **NaturalEvents**                 |
| Root package name  | `terrawatch`                      |
| React URL          | `natural-events-react.vercel.app` |
| Vue URL            | `natural-events-vue.vercel.app`   |
| Browser tab title  | Set in `index.html` files         |
| About page heading | "About NaturalEvents"             |

---

## 16. Comfortable answering questions and explaining engineering decisions

> _I am comfortable answering questions about my project and explaining my engineering decisions._

### Presenter script

> "If we have time for questions, I'm happy to go deeper into any of the decisions I made. I'll try to answer in three parts: **what I chose**, **why it was a good fit**, and **what the tradeoff was**. I can walk through the data flow from filter panel to store to API to UI, or explain why I picked specific libraries."

### Common questions and how to answer them

**Q: Why a monorepo instead of two separate repos?**

> "So both apps can share TypeScript types and API constants from `packages/shared/`. One change updates both apps. It also means one CI pipeline instead of duplicating everything."

**Q: Why Zustand for React and Pinia for Vue?**

> "Zustand is a popular lightweight state manager for React — much simpler than Redux. Pinia is the official state library for Vue 3. Both follow a similar pattern."

**Q: Why Leaflet for maps?**

> "Leaflet is free, open-source, and doesn't need an API key — unlike Google Maps or Mapbox."

**Q: Why Axios instead of fetch?**

> "Axios has cleaner syntax for query parameters — you pass them as an object. It also auto-parses JSON. With fetch, I'd need to manually build query strings and call `.json()` every time."

**Q: Why put filters in a global store?**

> "Filters are used on multiple pages. If I kept them in component state, they'd reset every time you navigate. A global store keeps them persistent across pages."

**Q: How does the data flow work?**

> "User changes a filter → store updates → hook notices and re-fetches from the API → new data comes back → all components using that hook re-render. FilterPanel → Store → Hook → API → Map / StatsBar / Charts."

**Q: How do the map marker colors work?**

> "Earthquake markers are colored by depth — shallow is orange, deep is blue. Size is based on magnitude. EONET events are colored by category — red for fires, purple for storms, etc."

**Q: Why lazy-load the map?**

> "Leaflet is a big library. Lazy-loading means it's not included in the initial page load, so the app starts faster."

**Q: What APIs do you use?**

> "USGS for real-time earthquakes and NASA EONET for natural events like wildfires and storms. Both are free, no API keys needed."

**Q: How does Event Detail know if it's an earthquake or EONET event?**

> "It checks the ID. EONET IDs start with `EONET_`, earthquake IDs don't. One `startsWith` check routes to the right API."

---

## Quick Demo Script (suggested order)

> **Start:** "I'll show both deployed apps first so you can see they look the same, then demo the interactions, then show some code and tests."

1. **Open both live apps** side by side — show they look identical
2. **Dashboard tour:** map, colored markers, stats bar
3. **Click a marker** → popup → "View details" → detail page → "Back to Dashboard"
4. **Filter interaction:** toggle event type, change magnitude, change dates
5. **Click "Reset"** — everything goes back to defaults
6. **Analytics page:** show the charts
7. **About page:** quick glance
8. **Code walkthrough:**
   - `packages/shared/constants.ts` — API URLs
   - `apps/react/src/services/usgs.ts` — API call
   - `apps/react/src/hooks/useEarthquakes.ts` — data flow
   - `apps/react/src/store/filterStore.ts` — global state
   - Briefly show Vue equivalents
9. **Tests:** run `npm run test` — show all passing
10. **CI:** open `ci.yml` + show a green PR on GitHub
11. **E2E:** open `e2e/react/navigation.spec.ts`
12. **Storybook:** run `npm run storybook:react`
13. **READMEs:** show on GitHub

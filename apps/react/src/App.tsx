import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const Analytics = lazy(() => import('./pages/Analytics'));
const About = lazy(() => import('./pages/About'));

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;

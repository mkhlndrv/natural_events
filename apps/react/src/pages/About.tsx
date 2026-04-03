function About() {
  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
          About NaturalEvents
        </h1>
        <p className="mt-4 text-lg text-slate-400 font-medium">
          A real-time earthquake and natural event monitoring dashboard. Track
          seismic activity worldwide and follow natural events like wildfires,
          storms, and volcanic eruptions as they unfold.
        </p>
      </div>

      <div className="rounded-xl border border-white/5 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
        <h2 className="mb-4 text-lg font-semibold text-slate-200 border-b border-white/5 pb-2">
          Data APIs
        </h2>
        <ul className="space-y-3 text-sm text-slate-300">
          <li>
            <a
              href="https://earthquake.usgs.gov/fdsnws/event/1/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              USGS Earthquake API
            </a>{' '}
            — Real-time earthquake data from the U.S. Geological Survey,
            including magnitude, location, and depth.
          </li>
          <li>
            <a
              href="https://eonet.gsfc.nasa.gov/docs/v3"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              NASA EONET v3
            </a>{' '}
            — Earth Observatory Natural Event Tracker. Tracks wildfires, severe
            storms, volcanoes, sea ice, and other natural events globally.
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-white/5 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
        <h2 className="mb-4 text-lg font-semibold text-slate-200 border-b border-white/5 pb-2">
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            'React',
            'TypeScript',
            'Vite',
            'Tailwind CSS',
            'React Router',
            'Leaflet',
            'Recharts',
            'Zustand',
            'Axios',
            'Vitest',
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
        <h2 className="mb-4 text-lg font-semibold text-slate-200 border-b border-white/5 pb-2">
          Course
        </h2>
        <p className="text-sm text-slate-300 font-medium leading-relaxed">
          Built for the Frontend Frameworks course at Harbour.Space University.
          This project compares React and Vue by implementing the same
          application in both frameworks using a shared monorepo.
        </p>
      </div>
    </div>
  );
}

export default About;

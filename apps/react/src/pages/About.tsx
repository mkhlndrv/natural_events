function About() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          About NaturalEvents
        </h1>
        <p className="mt-2 text-gray-600">
          A real-time earthquake and natural event monitoring dashboard. Track
          seismic activity worldwide and follow natural events like wildfires,
          storms, and volcanic eruptions as they unfold.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Data APIs</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            <a
              href="https://earthquake.usgs.gov/fdsnws/event/1/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 hover:underline"
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
              className="font-medium text-indigo-600 hover:underline"
            >
              NASA EONET v3
            </a>{' '}
            — Earth Observatory Natural Event Tracker. Tracks wildfires, severe
            storms, volcanoes, sea ice, and other natural events globally.
          </li>
        </ul>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Tech Stack</h2>
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
              className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Course</h2>
        <p className="text-sm text-gray-600">
          Built for the Frontend Frameworks course at Harbour.Space University.
          This project compares React and Vue by implementing the same
          application in both frameworks using a shared monorepo.
        </p>
      </div>
    </div>
  );
}

export default About;

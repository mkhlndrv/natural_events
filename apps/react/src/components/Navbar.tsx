import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/about', label: 'About' },
];

function Navbar() {
  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent drop-shadow-sm">
            NaturalEvents
          </span>
          <div className="flex space-x-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-indigo-500/20'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 hover:shadow-sm'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

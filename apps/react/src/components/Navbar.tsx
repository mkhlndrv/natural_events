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
      className="border-b border-gray-200 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-indigo-600">
            NaturalEvents
          </span>
          <div className="flex space-x-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
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

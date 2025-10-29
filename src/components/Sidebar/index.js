import { NavLink } from 'react-router-dom';
const links = [
  { to: '/', label: 'Create Job' },
  { to: '/raw-material', label: 'Raw Material' },
  { to: '/production', label: 'Production' },
  { to: '/items', label: 'Items' },
  { to: '/stones', label: 'Stones' },
  { to: '/summary', label: 'Summary' },
  { to: '/reports', label: 'Reports' }
  
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r min-h-screen sticky top-0 flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold text-yellow-700">Gold Workshop</h1>
        <p className="text-sm  font-semibold text-yellow-700">Management</p>
      </div>

      <nav className="p-4 flex-1">
        <div className="mb-4">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md mb-1 transition-colors ${
                  isActive ? 'bg-yellow-100 text-yellow-800 font-medium' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t text-xs text-gray-500">
        <div className="mb-1">Demo Mode — Local data only</div>
      </div>
    </aside>
  );
}

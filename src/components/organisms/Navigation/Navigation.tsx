import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">⏱️</span>
            <span className="text-xl font-bold text-gray-900">Workout Timer</span>
          </Link>
          
          {!isHome && (
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Go to home"
            >
              ← Back to Home
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

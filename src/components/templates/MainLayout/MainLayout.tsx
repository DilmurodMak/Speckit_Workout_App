import { Outlet } from 'react-router-dom';
import Navigation from '../../organisms/Navigation/Navigation';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <Outlet />
      </main>
    </div>
  );
}

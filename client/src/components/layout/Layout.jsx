import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * Main layout wrapper — renders Navbar above the page content.
 * Uses Outlet for React Router nested routes.
 */
const Layout = () => {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/editor');

  return (
    <div className="min-h-screen workspace-shell">
      {!isEditor && <Navbar />}
      <main className={isEditor ? 'pt-0' : 'pt-16'}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

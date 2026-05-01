import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * Main layout wrapper — renders Navbar above the page content.
 * Uses Outlet for React Router nested routes.
 */
const Layout = () => {
  const location = useLocation();
  const isWorkspace = location.pathname.startsWith('/editor') || location.pathname.startsWith('/workspace') || location.pathname.startsWith('/file/');

  return (
    <div className="min-h-screen workspace-shell">
      {!isWorkspace && <Navbar />}
      <main className={isWorkspace ? 'pt-0' : 'pt-16'}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import WorkspacePage from './pages/WorkspacePage';
import FilePage from './pages/FilePage';
import LibraryPage from './pages/LibraryPage';
import MarketplacePage from './pages/MarketplacePage';
import ListingPage from './pages/ListingPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import useAuthStore from './store/authStore';

/**
 * OAuth callback handler — captures token from URL and stores it.
 */
const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { setTokenFromOAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setTokenFromOAuth(token);
    }
  }, [searchParams, setTokenFromOAuth]);

  return <Navigate to="/editor" replace />;
};

/**
 * Protected route wrapper — redirects to login if not authenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * App root — React Router with all page routes.
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="auth/callback" element={<AuthCallback />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="marketplace/:id" element={<ListingPage />} />
          <Route path="profile/:id" element={<ProfilePage />} />

          {/* Editor — open to all (prompt signup to save) */}
          <Route path="editor" element={<WorkspacePage />} />
          <Route path="workspace" element={<WorkspacePage />} />
          <Route path="file/:fileId" element={<FilePage />} />

          {/* Protected routes */}
          <Route
            path="library"
            element={
              <ProtectedRoute>
                <LibraryPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

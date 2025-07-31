import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Navbar from './Navbar';

/**
 * A layout component for all protected pages.
 * It handles both authentication checks and rendering the common UI (Navbar).
 */
function MainLayout() {
  const { user, isLoading } = useAuthStore();

  // 1. Show a loading indicator while the auth state is being determined.
  if (isLoading) {
    return <div>Loading session...</div>;
  }

  // 2. If the user is not authenticated, redirect them to the login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If the user is authenticated, render the main layout with the Navbar
  //    and the nested page content via the <Outlet />.
  return (
    <div>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;

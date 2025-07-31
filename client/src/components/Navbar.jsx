import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useAuthStore from '../store/authStore';

function Navbar() {
  const { logOut } = useAuth();
  const user = useAuthStore((state) => state.user);

  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
      <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
      <Link to="/expenses" style={{ marginRight: '1rem' }}>Expenses</Link>
      <Link to="/incomes" style={{ marginRight: '1rem' }}>Incomes</Link>
      <Link to="/categories" style={{ marginRight: '1rem' }}>Categories</Link>
      <div style={{ float: 'right' }}>
        {user && <span style={{ marginRight: '1rem' }}>{user.email}</span>}
        <button onClick={logOut}>Log Out</button>
      </div>
    </nav>
  );
}

export default Navbar;

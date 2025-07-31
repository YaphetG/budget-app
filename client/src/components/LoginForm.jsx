import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import useAuthStore from '../store/authStore';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { logIn } = useAuth();
  const { isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    await logIn(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log In to Your Household</h2>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging In...' : 'Log In'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </form>
  );
}

export default LoginForm;

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import useAuthStore from '../store/authStore';

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp } = useAuth();
  const { isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    await signUp(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a New Household Account</h2>
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
          minLength="6"
          required
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </form>
  );
}

export default SignUpForm;

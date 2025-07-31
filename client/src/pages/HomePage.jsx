import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Welcome to $-track</h1>
      <p>Your personal budget tracker.</p>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
      </nav>
    </div>
  );
}

export default HomePage;

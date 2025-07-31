import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import useAuthStore from '../store/authStore';

function LoginPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div>
      <LoginForm />
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default LoginPage;

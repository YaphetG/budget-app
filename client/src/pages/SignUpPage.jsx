import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignUpForm from '../components/SignUpForm';
import useAuthStore from '../store/authStore';

function SignUpPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div>
      <SignUpForm />
      <p>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
}

export default SignUpPage;

import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import useAuthStore from './store/authStore';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import CategoryPage from './pages/CategoryPage';
import ExpensesPage from './pages/ExpensesPage';
import AddExpensePage from './pages/AddExpensePage';
import IncomesPage from './pages/IncomesPage';
import AddIncomePage from './pages/AddIncomePage';
import NotFoundPage from './pages/NotFoundPage';
import MainLayout from './components/MainLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/categories',
        element: <CategoryPage />,
      },
      {
        path: '/expenses',
        element: <ExpensesPage />,
      },
      {
        path: '/add-expense',
        element: <AddExpensePage />,
      },
      {
        path: '/incomes',
        element: <IncomesPage />,
      },
      {
        path: '/add-income',
        element: <AddIncomePage />,
      },
    ],
  },
]);

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const setHouseholdId = useAuthStore((state) => state.setHouseholdId);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setHouseholdId(userDoc.data().householdId);
        }
        setUser(user);
      } else {
        setUser(null);
        setHouseholdId(null);
      }
    });

    return () => unsubscribe();
  }, [setUser, setHouseholdId]);

  return <RouterProvider router={router} />;
}

export default App;

import React from 'react';
import { Link } from 'react-router-dom';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';

function CategoryPage() {
  return (
    <div>
      <h1>Manage Expense Categories</h1>
      <nav>
        <Link to="/dashboard">Back to Dashboard</Link>
      </nav>
      <hr />
      <CategoryForm />
      <hr />
      <CategoryList />
    </div>
  );
}

export default CategoryPage;

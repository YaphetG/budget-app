import React from 'react';
import { Link } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';

function AddExpensePage() {
  return (
    <div>
      <nav>
        <Link to="/expenses">Back to Expense List</Link>
      </nav>
      <ExpenseForm />
    </div>
  );
}

export default AddExpensePage;

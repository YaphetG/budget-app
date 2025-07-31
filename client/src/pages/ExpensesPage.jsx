import React from 'react';
import { Link } from 'react-router-dom';
import ExpenseList from '../components/ExpenseList';

function ExpensesPage() {
  return (
    <div>
      <h1>Expenses</h1>
      <nav>
        <Link to="/dashboard">Dashboard</Link> | <Link to="/add-expense">Add New Expense</Link>
      </nav>
      <hr />
      <ExpenseList />
    </div>
  );
}

export default ExpensesPage;

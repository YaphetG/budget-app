import React from 'react';
import { Link } from 'react-router-dom';
import IncomeList from '../components/IncomeList';

function IncomesPage() {
  return (
    <div>
      <h1>Incomes</h1>
      <nav>
        <Link to="/dashboard">Dashboard</Link> | <Link to="/add-income">Add New Income</Link>
      </nav>
      <hr />
      <IncomeList />
    </div>
  );
}

export default IncomesPage;

import React from 'react';
import { Link } from 'react-router-dom';
import IncomeForm from '../components/IncomeForm';

function AddIncomePage() {
  return (
    <div>
      <nav>
        <Link to="/incomes">Back to Income List</Link>
      </nav>
      <IncomeForm />
    </div>
  );
}

export default AddIncomePage;

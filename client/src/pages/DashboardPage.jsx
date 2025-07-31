import React from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useIncomes } from '../hooks/useIncomes';

function DashboardPage() {
  const { expenses, loading: expensesLoading } = useExpenses();
  const { incomes, loading: incomesLoading } = useIncomes();

  if (expensesLoading || incomesLoading) {
    return <p>Loading dashboard data...</p>;
  }

  // Calculate current month's summary
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    })
    .reduce((total, expense) => total + expense.amount, 0);

  const monthlyIncomes = incomes
    .filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
    })
    .reduce((total, income) => total + income.amount, 0);

  const netSavings = monthlyIncomes - monthlyExpenses;

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Current Month Summary ({today.toLocaleString('default', { month: 'long', year: 'numeric' })})</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '1rem 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3>Total Income</h3>
          <p style={{ color: 'green', fontSize: '1.5rem' }}>${monthlyIncomes.toFixed(2)}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3>Total Expenses</h3>
          <p style={{ color: 'red', fontSize: '1.5rem' }}>${monthlyExpenses.toFixed(2)}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3>Net Savings</h3>
          <p style={{ color: netSavings >= 0 ? 'blue' : 'orange', fontSize: '1.5rem' }}>
            ${netSavings.toFixed(2)}
          </p>
        </div>
      </div>

      <hr />

      {/* Future sections for budget progress and projections will go here */}
      <p>Welcome to your household budget tracker!</p>
    </div>
  );
}

export default DashboardPage;

import React from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useIncomes } from '../hooks/useIncomes';
import { useBudgets } from '../hooks/useBudgets';
import { useCategories } from '../hooks/useCategories';
import { useBalances } from '../hooks/useBalances';
import BudgetProgress from '../components/BudgetProgress';
import BalanceManager from '../components/BalanceManager';
import ProjectionChart from '../components/ProjectionChart';

function DashboardPage() {
  const { expenses, loading: expensesLoading } = useExpenses();
  const { incomes, loading: incomesLoading } = useIncomes();
  const { budgets, loading: budgetsLoading } = useBudgets();
  const { categories, loading: categoriesLoading } = useCategories();
  const { balances, loading: balancesLoading } = useBalances();

  if (expensesLoading || incomesLoading || budgetsLoading || categoriesLoading || balancesLoading) {
    return <p>Loading dashboard data...</p>;
  }

  // --- Monthly Summary Calculation ---
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthlyExpenses = expenses
    .filter(e => new Date(e.date).getMonth() === currentMonth && new Date(e.date).getFullYear() === currentYear)
    .reduce((sum, e) => sum + e.amount, 0);

  const monthlyIncomes = incomes
    .filter(i => new Date(i.date).getMonth() === currentMonth && new Date(i.date).getFullYear() === currentYear)
    .reduce((sum, i) => sum + i.amount, 0);

  const netSavings = monthlyIncomes - monthlyExpenses;

  // --- Budget Progress Calculation ---
  const categoryMap = categories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.name }), {});
  const spendingPerCategory = expenses
    .filter(e => new Date(e.date).getMonth() === currentMonth && new Date(e.date).getFullYear() === currentYear)
    .reduce((acc, e) => ({ ...acc, [e.categoryId]: (acc[e.categoryId] || 0) + e.amount }), {});
  const budgetedCategories = Object.keys(budgets);

  // --- Projection Calculation ---
  const calculateProjection = () => {
    const monthlyBudgetedExpenses = Object.values(budgets).reduce((sum, b) => sum + b.monthlyLimit, 0);
    const monthlyRecurringIncome = incomes
      .filter(i => i.isRecurring)
      .reduce((sum, i) => {
        if (i.recurrenceFrequency === 'Annually') return sum + i.amount / 12;
        if (i.recurrenceFrequency === 'Bi-weekly') return sum + (i.amount * 26) / 12;
        return sum + i.amount; // Assumes Monthly
      }, 0);

    const monthlyNet = monthlyRecurringIncome - monthlyBudgetedExpenses;
    const startingBalance = balances.checkingBalance + balances.savingsBalance;

    const projectionData = [];
    let currentBalance = startingBalance;

    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(today.getMonth() + i);
      projectionData.push({
        month: date.toLocaleString('default', { month: 'short' }),
        projectedBalance: currentBalance,
      });
      currentBalance += monthlyNet;
    }
    return projectionData;
  };

  const projectionData = calculateProjection();

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Current Month Summary ({today.toLocaleString('default', { month: 'long', year: 'numeric' })})</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '1rem 0', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', margin: '0 1rem' }}>
          <h3>Total Income</h3>
          <p style={{ color: 'green', fontSize: '1.5rem' }}>${monthlyIncomes.toFixed(2)}</p>
        </div>
        <div style={{ textAlign: 'center', margin: '0 1rem' }}>
          <h3>Total Expenses</h3>
          <p style={{ color: 'red', fontSize: '1.5rem' }}>${monthlyExpenses.toFixed(2)}</p>
        </div>
        <div style={{ textAlign: 'center', margin: '0 1rem' }}>
          <h3>Net Savings</h3>
          <p style={{ color: netSavings >= 0 ? 'blue' : 'orange', fontSize: '1.5rem' }}>
            ${netSavings.toFixed(2)}
          </p>
        </div>
      </div>

      <hr />

      <h2>Monthly Budget Progress</h2>
      <div>
        {budgetedCategories.length > 0 ? budgetedCategories.map(catId => (
          <BudgetProgress key={catId} name={categoryMap[catId]} spent={spendingPerCategory[catId] || 0} limit={budgets[catId].monthlyLimit}/>
        )) : <p>No budgets set for this month. Go to the Budgets page to add some!</p>}
      </div>

      <hr />

      <ProjectionChart projectionData={projectionData} />

      <hr />

      <BalanceManager />
    </div>
  );
}

export default DashboardPage;

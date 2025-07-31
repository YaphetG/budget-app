import React, { useState } from 'react';
import { useIncomes } from '../hooks/useIncomes';
import IncomeForm from './IncomeForm'; // To use for editing

function IncomeList() {
  const { incomes, loading, deleteIncome } = useIncomes();
  const [editingIncome, setEditingIncome] = useState(null);

  if (loading) {
    return <p>Loading incomes...</p>;
  }

  const handleEdit = (income) => {
    setEditingIncome(income);
  };

  const handleCancelEdit = () => {
    setEditingIncome(null);
  };

  const handleFormSubmit = () => {
    setEditingIncome(null);
  };

  return (
    <div>
      <h3>Income History</h3>
      {editingIncome && (
        <div>
          <IncomeForm incomeToEdit={editingIncome} onFormSubmit={handleFormSubmit} />
          <button onClick={handleCancelEdit}>Cancel Edit</button>
          <hr />
        </div>
      )}
      {incomes.length === 0 ? (
        <p>No income recorded yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>Amount</th>
              <th>Recurring</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income) => (
              <tr key={income.id}>
                <td>{new Date(income.date).toLocaleDateString()}</td>
                <td>{income.source}</td>
                <td>${income.amount.toFixed(2)}</td>
                <td>{income.isRecurring ? income.recurrenceFrequency : 'No'}</td>
                <td>
                  <button onClick={() => handleEdit(income)}>Edit</button>
                  <button onClick={() => deleteIncome(income.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default IncomeList;

import React, { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useCategories } from '../hooks/useCategories';
import ExpenseForm from './ExpenseForm'; // To use for editing

function ExpenseList() {
  const { expenses, loading, deleteExpense } = useExpenses();
  const { categories } = useCategories();
  const [editingExpense, setEditingExpense] = useState(null);

  // Create a map of category IDs to names for easy lookup
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});

  if (loading) {
    return <p>Loading expenses...</p>;
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleFormSubmit = () => {
    // This function is passed to the form to close it after submission
    setEditingExpense(null);
  };

  return (
    <div>
      <h3>Expense History</h3>
      {editingExpense && (
        <div>
          <ExpenseForm expenseToEdit={editingExpense} onFormSubmit={handleFormSubmit} />
          <button onClick={handleCancelEdit}>Cancel Edit</button>
          <hr />
        </div>
      )}
      {expenses.length === 0 ? (
        <p>No expenses recorded yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>{expense.description}</td>
                <td>{categoryMap[expense.categoryId] || 'Uncategorized'}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEdit(expense)}>Edit</button>
                  <button onClick={() => deleteExpense(expense.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ExpenseList;

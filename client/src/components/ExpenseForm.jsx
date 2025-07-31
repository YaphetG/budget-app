import React, { useState, useEffect } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useCategories } from '../hooks/useCategories';

// The form component can be used for both adding and editing expenses.
// If `expenseToEdit` is passed, it will pre-fill the form for editing.
function ExpenseForm({ expenseToEdit, onFormSubmit }) {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [description, setDescription] = useState('');

  const { categories } = useCategories();
  const { addExpense, updateExpense } = useExpenses();

  // If we are editing an expense, pre-fill the form fields
  useEffect(() => {
    if (expenseToEdit) {
      setAmount(expenseToEdit.amount);
      setCategoryId(expenseToEdit.categoryId);
      // Format date for the input field
      setDate(new Date(expenseToEdit.date).toISOString().split('T')[0]);
      setDescription(expenseToEdit.description);
    }
  }, [expenseToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !categoryId || !date) {
      alert('Please fill out all required fields.');
      return;
    }

    const expenseData = {
      amount: parseFloat(amount),
      categoryId,
      date,
      description,
    };

    if (expenseToEdit) {
      await updateExpense(expenseToEdit.id, expenseData);
    } else {
      await addExpense(expenseData);
    }

    // Notify parent component that submission is complete to close the form/modal
    if (onFormSubmit) {
      onFormSubmit();
    }

    // Reset form fields for a new entry
    if (!expenseToEdit) {
        setAmount('');
        setCategoryId('');
        setDate(new Date().toISOString().split('T')[0]);
        setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{expenseToEdit ? 'Edit Expense' : 'Add New Expense'}</h3>
      <div>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select a Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description (Optional):</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit">{expenseToEdit ? 'Update' : 'Add'} Expense</button>
    </form>
  );
}

export default ExpenseForm;

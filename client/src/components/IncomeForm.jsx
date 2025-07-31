import React, { useState, useEffect } from 'react';
import { useIncomes } from '../hooks/useIncomes';

function IncomeForm({ incomeToEdit, onFormSubmit }) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [source, setSource] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState('Monthly');

  const { addIncome, updateIncome } = useIncomes();

  useEffect(() => {
    if (incomeToEdit) {
      setAmount(incomeToEdit.amount);
      setDate(new Date(incomeToEdit.date).toISOString().split('T')[0]);
      setSource(incomeToEdit.source);
      setIsRecurring(incomeToEdit.isRecurring || false);
      setRecurrenceFrequency(incomeToEdit.recurrenceFrequency || 'Monthly');
    }
  }, [incomeToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !date || !source) {
      alert('Please fill out amount, date, and source.');
      return;
    }

    const incomeData = {
      amount: parseFloat(amount),
      date,
      source,
      isRecurring,
      recurrenceFrequency: isRecurring ? recurrenceFrequency : null,
    };

    if (incomeToEdit) {
      await updateIncome(incomeToEdit.id, incomeData);
    } else {
      await addIncome(incomeData);
    }

    if (onFormSubmit) {
      onFormSubmit();
    }

    if (!incomeToEdit) {
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setSource('');
        setIsRecurring(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{incomeToEdit ? 'Edit Income' : 'Add New Income'}</h3>
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
        <label htmlFor="source">Source/Description:</label>
        <input
          type="text"
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="e.g., Salary, Bonus"
          required
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          Is this recurring?
        </label>
      </div>
      {isRecurring && (
        <div>
          <label htmlFor="recurrenceFrequency">Frequency:</label>
          <select
            id="recurrenceFrequency"
            value={recurrenceFrequency}
            onChange={(e) => setRecurrenceFrequency(e.target.value)}
          >
            <option value="Monthly">Monthly</option>
            <option value="Bi-weekly">Bi-weekly</option>
            <option value="Annually">Annually</option>
          </select>
        </div>
      )}
      <button type="submit">{incomeToEdit ? 'Update' : 'Add'} Income</button>
    </form>
  );
}

export default IncomeForm;

import React, { useState, useEffect } from 'react';
import { useBalances } from '../hooks/useBalances';

function BalanceManager() {
  const { balances, loading, updateBalances } = useBalances();
  const [checking, setChecking] = useState('');
  const [savings, setSavings] = useState('');

  // When balances are fetched from the DB, update the local form state.
  useEffect(() => {
    if (balances) {
      setChecking(balances.checkingBalance);
      setSavings(balances.savingsBalance);
    }
  }, [balances]);

  const handleSave = () => {
    updateBalances({
      checkingBalance: checking,
      savingsBalance: savings,
    });
  };

  if (loading) {
    return <p>Loading balances...</p>;
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h3>Manage Account Balances</h3>
      <p>Enter your current total checking and savings account balances.</p>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="checking">Checking Account Balance: $</label>
        <input
          type="number"
          id="checking"
          value={checking}
          onChange={(e) => setChecking(e.target.value)}
          placeholder="0.00"
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="savings">Savings Account Balance: $</label>
        <input
          type="number"
          id="savings"
          value={savings}
          onChange={(e) => setSavings(e.target.value)}
          placeholder="0.00"
        />
      </div>
      <button onClick={handleSave}>Save Balances</button>
    </div>
  );
}

export default BalanceManager;

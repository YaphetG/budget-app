import React from 'react';
import { useCategories } from '../hooks/useCategories';
import { useBudgets } from '../hooks/useBudgets';

function BudgetPage() {
  const { categories, loading: categoriesLoading } = useCategories();
  const { budgets, setBudget } = useBudgets();

  const handleBudgetChange = (categoryId, amount) => {
    // Call the setBudget function from the hook to update Firestore.
    // The amount is parsed to ensure it's a number.
    setBudget(categoryId, parseFloat(amount));
  };

  if (categoriesLoading) {
    return <p>Loading categories...</p>;
  }

  return (
    <div>
      <h1>Set Monthly Budgets</h1>
      <p>Enter a monthly spending limit for each expense category.</p>
      <div style={{ maxWidth: '600px' }}>
        {categories.length === 0 ? (
          <p>You need to add some expense categories first!</p>
        ) : (
          categories.map((category) => (
            <div key={category.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <label htmlFor={`budget-${category.id}`}>{category.name}</label>
              <div>
                $
                <input
                  type="number"
                  id={`budget-${category.id}`}
                  // The value is the existing budget for this category, or an empty string.
                  value={budgets[category.id]?.monthlyLimit || ''}
                  placeholder="0.00"
                  // Using onBlur is often better for performance than onChange for database writes.
                  // It saves the value when the user clicks away from the input field.
                  onBlur={(e) => handleBudgetChange(category.id, e.target.value)}
                  style={{ width: '100px', marginLeft: '0.5rem' }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BudgetPage;

import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';

function CategoryForm() {
  const [name, setName] = useState('');
  const { addCategory } = useCategories();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === '') {
      alert('Category name cannot be empty.');
      return;
    }
    await addCategory(name);
    setName(''); // Reset form field
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Category</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Groceries"
        required
      />
      <button type="submit">Add Category</button>
    </form>
  );
}

export default CategoryForm;

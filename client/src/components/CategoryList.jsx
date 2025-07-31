import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';

function CategoryList() {
  const { categories, loading, updateCategory, deleteCategory } = useCategories();
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  if (loading) {
    return <p>Loading categories...</p>;
  }

  const handleEdit = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSave = async (id) => {
    if (editingName.trim() === '') {
      alert('Category name cannot be empty.');
      return;
    }
    await updateCategory(id, editingName);
    handleCancel(); // Exit editing mode
  };

  return (
    <div>
      <h3>Existing Categories</h3>
      {categories.length === 0 ? (
        <p>No categories found. Add one to get started!</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              {editingId === category.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <button onClick={() => handleSave(category.id)}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                </>
              ) : (
                <>
                  {category.name}
                  <button onClick={() => handleEdit(category)}>Edit</button>
                  <button onClick={() => deleteCategory(category.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryList;

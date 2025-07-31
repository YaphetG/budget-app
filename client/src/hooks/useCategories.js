import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import useAuthStore from '../store/authStore';

/**
 * A custom hook for managing category data (CRUD operations).
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const householdId = useAuthStore((state) => state.householdId);

  // Effect to fetch categories in real-time when householdId is available.
  useEffect(() => {
    if (!householdId) {
      setLoading(false);
      setCategories([]); // Clear categories if no householdId
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'categories'),
      where('householdId', '==', householdId)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const categoriesData = [];
        querySnapshot.forEach((doc) => {
          categoriesData.push({ id: doc.id, ...doc.data() });
        });
        setCategories(categoriesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching categories: ', error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [householdId]);

  // Function to add a new category
  const addCategory = async (name) => {
    if (!householdId || !name) return;
    try {
      await addDoc(collection(db, 'categories'), {
        name: name.trim(),
        householdId: householdId,
      });
    } catch (error) {
      console.error('Error adding category: ', error);
    }
  };

  // Function to update an existing category's name
  const updateCategory = async (id, newName) => {
    if (!id || !newName) return;
    const docRef = doc(db, 'categories', id);
    try {
      await updateDoc(docRef, { name: newName.trim() });
    } catch (error) {
      console.error('Error updating category: ', error);
    }
  };

  // Function to delete a category
  const deleteCategory = async (id) => {
    if (!id) return;
    const docRef = doc(db, 'categories', id);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting category: ', error);
    }
  };

  return { categories, loading, addCategory, updateCategory, deleteCategory };
};

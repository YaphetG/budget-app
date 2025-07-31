import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import useAuthStore from '../store/authStore';

/**
 * A custom hook for managing expense data (CRUD operations).
 * Fetches expenses in real-time and provides functions to modify them.
 */
export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const householdId = useAuthStore((state) => state.householdId);

  useEffect(() => {
    if (!householdId) {
      setLoading(false);
      setExpenses([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'expenses'),
      where('householdId', '==', householdId),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const expensesData = [];
        querySnapshot.forEach((doc) => {
          // Convert Firestore Timestamp to JS Date object for easier use in forms
          const data = doc.data();
          expensesData.push({
            id: doc.id,
            ...data,
            date: data.date.toDate(),
          });
        });
        setExpenses(expensesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching expenses:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [householdId]);

  const addExpense = async (expenseData) => {
    if (!householdId) return;
    try {
      await addDoc(collection(db, 'expenses'), {
        ...expenseData,
        householdId: householdId,
        // Convert JS Date back to Firestore Timestamp for storage
        date: Timestamp.fromDate(new Date(expenseData.date)),
      });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const updateExpense = async (id, expenseData) => {
    if (!id) return;
    const docRef = doc(db, 'expenses', id);
    try {
      await updateDoc(docRef, {
        ...expenseData,
        date: Timestamp.fromDate(new Date(expenseData.date)),
      });
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const deleteExpense = async (id) => {
    if (!id) return;
    const docRef = doc(db, 'expenses', id);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return { expenses, loading, addExpense, updateExpense, deleteExpense };
};

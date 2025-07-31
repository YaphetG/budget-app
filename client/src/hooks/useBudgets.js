import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
} from 'firebase/firestore';
import useAuthStore from '../store/authStore';

/**
 * A hook to manage budget data for a household.
 * Budgets are stored in a map-like structure for easy lookup,
 * with the categoryId being the key.
 */
export const useBudgets = () => {
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);
  const householdId = useAuthStore((state) => state.householdId);

  // Effect to listen for real-time budget changes for the household.
  useEffect(() => {
    if (!householdId) {
      setLoading(false);
      setBudgets({});
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'budgets'), where('householdId', '==', householdId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const budgetsData = {};
      querySnapshot.forEach((doc) => {
        // The document ID is the categoryId, so we use it as the key.
        budgetsData[doc.id] = doc.data();
      });
      setBudgets(budgetsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching budgets: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [householdId]);

  /**
   * Creates or updates the budget for a specific category.
   * @param {string} categoryId - The ID of the category to set the budget for.
   * @param {number} amount - The monthly budget limit.
   */
  const setBudget = async (categoryId, amount) => {
    if (!householdId || !categoryId) return;
    // Use the categoryId as the document ID for an efficient upsert.
    const budgetRef = doc(db, 'budgets', categoryId);
    try {
      await setDoc(budgetRef, {
        monthlyLimit: parseFloat(amount) || 0, // Ensure it's a number
        householdId: householdId,
      });
    } catch (error) {
      console.error("Error setting budget: ", error);
    }
  };

  return { budgets, loading, setBudget };
};

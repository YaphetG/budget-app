import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import useAuthStore from '../store/authStore';

/**
 * A hook to manage the household's account balances.
 * There is only one balance document per household, identified by the householdId.
 */
export const useBalances = () => {
  const [balances, setBalances] = useState({ checkingBalance: 0, savingsBalance: 0 });
  const [loading, setLoading] = useState(true);
  const householdId = useAuthStore((state) => state.householdId);

  useEffect(() => {
    if (!householdId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const docRef = doc(db, 'balances', householdId);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setBalances(doc.data());
      } else {
        // If no document exists, it means balances haven't been set yet.
        setBalances({ checkingBalance: 0, savingsBalance: 0 });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching balances: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [householdId]);

  /**
   * Creates or updates the household's balances.
   * @param {object} newBalances - An object with checkingBalance and/or savingsBalance.
   */
  const updateBalances = async (newBalances) => {
    if (!householdId) return;
    const docRef = doc(db, 'balances', householdId);
    try {
      // Use setDoc with merge: true to perform an upsert.
      // This will create the document if it doesn't exist, or update it if it does.
      await setDoc(docRef, {
        checkingBalance: parseFloat(newBalances.checkingBalance) || 0,
        savingsBalance: parseFloat(newBalances.savingsBalance) || 0,
        lastUpdated: new Date(),
      }, { merge: true });
    } catch (error) {
      console.error("Error updating balances: ", error);
    }
  };

  return { balances, loading, updateBalances };
};

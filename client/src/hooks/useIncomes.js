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
 * A custom hook for managing income data (CRUD operations).
 */
export const useIncomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const householdId = useAuthStore((state) => state.householdId);

  useEffect(() => {
    if (!householdId) {
      setLoading(false);
      setIncomes([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'incomes'),
      where('householdId', '==', householdId),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const incomesData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          incomesData.push({
            id: doc.id,
            ...data,
            date: data.date.toDate(),
          });
        });
        setIncomes(incomesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching incomes:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [householdId]);

  const addIncome = async (incomeData) => {
    if (!householdId) return;
    try {
      await addDoc(collection(db, 'incomes'), {
        ...incomeData,
        householdId: householdId,
        date: Timestamp.fromDate(new Date(incomeData.date)),
      });
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const updateIncome = async (id, incomeData) => {
    if (!id) return;
    const docRef = doc(db, 'incomes', id);
    try {
      await updateDoc(docRef, {
        ...incomeData,
        date: Timestamp.fromDate(new Date(incomeData.date)),
      });
    } catch (error) {
      console.error('Error updating income:', error);
    }
  };

  const deleteIncome = async (id) => {
    if (!id) return;
    const docRef = doc(db, 'incomes', id);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  return { incomes, loading, addIncome, updateIncome, deleteIncome };
};

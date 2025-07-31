import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { auth, db } from '../firebase/config';
import useAuthStore from '../store/authStore';

/**
 * A custom hook to manage all authentication-related logic.
 */
export const useAuth = () => {
  const { authStart, authSuccess, authFail, logOut: logOutStore } = useAuthStore();

  /**
   * Signs up a new user, creates a new household, and a corresponding user document.
   * This function is for the FIRST user of a household.
   */
  const signUp = async (email, password) => {
    authStart();
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create a new household and user document in a single transaction (batch write)
      const householdId = nanoid(10); // Generate a unique 10-character ID
      const batch = writeBatch(db);

      // - Household document
      const householdRef = doc(db, 'households', householdId);
      batch.set(householdRef, {
        name: `Household of ${user.email}`, // A default name
        members: [user.uid],
        owner: user.uid,
      });

      // - User document
      const userRef = doc(db, 'users', user.uid);
      batch.set(userRef, {
        email: user.email,
        householdId: householdId,
      });

      await batch.commit();

      // 3. Update the global state
      authSuccess(user, householdId);
    } catch (error) {
      console.error("Sign up error:", error);
      authFail(error);
    }
  };

  /**
   * Logs in an existing user and fetches their household data.
   */
  const logIn = async (email, password) => {
    authStart();
    try {
      // 1. Sign in the user via Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Fetch the user's document from Firestore to get their householdId
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const householdId = userDoc.data().householdId;
        // 3. Update the global state
        authSuccess(user, householdId);
      } else {
        // This indicates a data consistency issue, as every user should have a document.
        throw new Error("User data not found in Firestore.");
      }
    } catch (error) {
      console.error("Log in error:", error);
      authFail(error);
    }
  };

  /**
   * Logs out the current user.
   */
  const logOut = async () => {
    try {
      await signOut(auth);
      logOutStore(); // Clears the state in the store
    } catch (error) {
      console.error("Log out error:", error);
      // Still log out on the client-side even if Firebase fails
      logOutStore();
    }
  };

  return { signUp, logIn, logOut };
};

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';

// IMPORTANT: I need the user's actual firebase config.
// The placeholder file won't work. I'll read the config file
// and have to assume the user has populated it.
// To do that, I need to read the file first, then inject it.
// For now, I'll create the script with a placeholder config
// and in the next step, I'll read the real config and replace it.
// This is getting complicated.

// Let's simplify. I will just create the script assuming the config is available
// via the import. The import path needs to be correct.
// `config.js` exports `auth` and `db`. I can just import and use them.

import { auth, db } from './src/firebase/config.js';

console.log('--- Starting Verification Script ---');

const randomId = nanoid(8);
const testEmail = `testuser-${randomId}@example.com`;
const testPassword = 'password123';
let testUser;
let householdId;
let categoryId;
let expenseId;

async function runTest() {
  try {
    // --- 1. Sign Up & Household Creation ---
    console.log(`\n[1/5] Signing up new user: ${testEmail}`);
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    testUser = userCredential.user;
    householdId = nanoid(10);
    const batch = writeBatch(db);
    const householdRef = doc(db, 'households', householdId);
    batch.set(householdRef, { name: 'Test Household', members: [testUser.uid], owner: testUser.uid });
    const userRef = doc(db, 'users', testUser.uid);
    batch.set(userRef, { email: testUser.email, householdId: householdId });
    await batch.commit();
    console.log(` -> Success: User and household ${householdId} created.`);

    // --- 2. Add Category ---
    console.log('\n[2/5] Adding new category...');
    const categoryRef = await addDoc(collection(db, 'categories'), {
      name: 'Test Groceries',
      householdId: householdId,
    });
    categoryId = categoryRef.id;
    console.log(` -> Success: Category ${categoryId} created.`);

    // --- 3. Add Expense ---
    console.log('\n[3/5] Adding new expense...');
    const expenseRef = await addDoc(collection(db, 'expenses'), {
      amount: 12.99,
      categoryId: categoryId,
      date: new Date(),
      description: 'Test bread and milk',
      householdId: householdId,
    });
    expenseId = expenseRef.id;
    console.log(` -> Success: Expense ${expenseId} created.`);

    // --- 4. Verify Data ---
    console.log('\n[4/5] Verifying created data...');
    const catDoc = await getDoc(doc(db, 'categories', categoryId));
    const expDoc = await getDoc(doc(db, 'expenses', expenseId));
    if (catDoc.exists() && expDoc.exists()) {
      console.log(' -> Success: Category and Expense documents found in Firestore.');
    } else {
      throw new Error('Verification failed: Documents not found.');
    }

  } catch (error) {
    console.error('\n--- SCRIPT FAILED ---');
    console.error(error.message);
  } finally {
    // --- 5. Clean Up ---
    console.log('\n[5/5] Cleaning up test data...');
    if (expenseId) await deleteDoc(doc(db, 'expenses', expenseId));
    if (categoryId) await deleteDoc(doc(db, 'categories', categoryId));
    if (householdId) await deleteDoc(doc(db, 'households', householdId));
    if (testUser) {
      await deleteDoc(doc(db, 'users', testUser.uid));
      // Deleting a user from Auth requires them to be recently signed in.
      // The createUser call above does this.
      await deleteUser(testUser);
      console.log(' -> Success: All test data cleaned up.');
    } else {
        console.log(' -> No user to clean up.');
    }
    console.log('\n--- Verification Script Finished ---');
  }
}

runTest();

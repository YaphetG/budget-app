import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvim8_u_80uXCWeDERG2pqIGZJQQgYCIA",
  authDomain: "budget-app-5a831.firebaseapp.com",
  projectId: "budget-app-5a831",
  storageBucket: "budget-app-5a831.appspot.com",
  messagingSenderId: "647041446085",
  appId: "1:647041446085:web:35960b4dfc3f1e5a3d40ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export the services for use in other parts of the app
export { auth, db };

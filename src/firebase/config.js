// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Firebase configuration settings
const firebaseConfig = {
  apiKey: "AIzaSyAkn2rvoqnPUeAVYt63Y_O0G0N3HDW-q_k",
  authDomain: "j70717-3800e.firebaseapp.com",
  databaseURL: "https://j70717-3800e.firebaseio.com",
  projectId: "j70717-3800e",
  storageBucket: "j70717-3800e.firebasestorage.app",
  messagingSenderId: "1069494517672",
  appId: "1:1069494517672:web:dfb672ec3e45ac64bda79d",
  measurementId: "G-NQXY42C68T"
};

// Initialize Firebase
let app, db, realtimeDb, auth;

try {
  // Initialize Firebase with fixed appId
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  realtimeDb = getDatabase(app);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  // Log error for debugging
  console.error('Firebase initialization failed:', error);
  
  // Provide fallback mock objects when Firebase fails to initialize
  console.log('Using mock Firebase data');
  app = {};
  db = {
    collection: () => ({
      doc: () => ({
        set: () => Promise.resolve(),
        get: () => Promise.resolve({ exists: () => false, data: () => ({}) }),
        update: () => Promise.resolve()
      }),
      where: () => ({
        get: () => Promise.resolve({ docs: [] })
      })
    })
  };
  realtimeDb = {
    ref: () => ({
      set: () => Promise.resolve(),
      update: () => Promise.resolve(),
      on: () => {},
      once: () => Promise.resolve({ val: () => null })
    })
  };
  auth = {
    onAuthStateChanged: () => {},
    signInAnonymously: () => Promise.resolve({ user: { uid: 'anonymous-user' } })
  };
}

export { db, realtimeDb, auth };
export default app;
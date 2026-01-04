import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAbI5Swc136jjPCKeH1erjoDuhG2GUPnn0",
  authDomain: "bilgisel-3e9a0.firebaseapp.com",
  databaseURL: "https://bilgisel-3e9a0-default-rtdb.firebaseio.com",
  projectId: "bilgisel-3e9a0",
  storageBucket: "bilgisel-3e9a0.appspot.com",
  messagingSenderId: "921907280109",
  appId: "1:921907280109:web:7d9b4844067a7a1ac174e4",
  measurementId: "G-XH10LS7DW8"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);

export { app, auth, firestore, database };

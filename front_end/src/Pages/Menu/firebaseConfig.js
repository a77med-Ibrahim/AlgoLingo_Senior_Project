import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAaiS4rJoSXvmhIroSm-ngE_fAhK-FMBY4",
  authDomain: "algolingo-f1d7a.firebaseapp.com",
  databaseURL: "https://algolingo-f1d7a-default-rtdb.firebaseio.com",
  projectId: "algolingo-f1d7a",
  storageBucket: "algolingo-f1d7a.appspot.com",
  messagingSenderId: "103572764164",
  appId: "1:103572764164:web:46085b9acc17ad5ad7e751",
  measurementId: "G-HQN6CQPF14"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { firebaseApp, firebaseAuth, db };
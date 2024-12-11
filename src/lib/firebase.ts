import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBK9HbtRkKPDX__DDLiEMJCQjmUgAB2l9U",
  authDomain: "projetoboltnew.firebaseapp.com",
  projectId: "projetoboltnew",
  storageBucket: "projetoboltnew.firebasestorage.app",
  messagingSenderId: "98124014663",
  appId: "1:98124014663:web:87a0dd5d3eaa647d49fd62"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/authStore';
import App from './App';
import './index.css';

// Set up auth listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Fetch complete user data including organization info
    await useAuthStore.getState().fetchUserData(user.uid);
  } else {
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setOrganization(null);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
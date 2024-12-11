import { create } from 'zustand';
import { User, Organization } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AuthState {
  user: User | null;
  organization: Organization | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setOrganization: (org: Organization | null) => void;
  fetchUserData: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  organization: null,
  loading: false,
  error: null,
  
  setUser: (user) => set({ user }),
  setOrganization: (organization) => set({ organization }),
  
  fetchUserData: async (userId) => {
    try {
      set({ loading: true, error: null });
      
      // Fetch user data
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        throw new Error('Usuário não encontrado');
      }
      
      const userData = userDoc.data() as User;
      
      // Fetch organization data if available
      if (userData.organizationId) {
        const orgDoc = await getDoc(doc(db, 'organizations', userData.organizationId));
        if (orgDoc.exists()) {
          set({ 
            user: userData,
            organization: orgDoc.data() as Organization,
            loading: false 
          });
        }
      } else {
        set({ 
          user: userData,
          organization: null,
          loading: false 
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      set({ 
        error: 'Erro ao carregar dados do usuário',
        loading: false 
      });
    }
  }
}));
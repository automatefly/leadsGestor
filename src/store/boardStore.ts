import { create } from 'zustand';
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Column, Lead, Note } from '../types';
import { useAuthStore } from './authStore';
import { nanoid } from 'nanoid';

interface BoardState {
  columns: Column[];
  leads: Lead[];
  loading: boolean;
  error: string | null;
  fetchBoard: () => Promise<void>;
  addColumn: (title: string) => Promise<void>;
  updateColumn: (columnId: string, data: Partial<Column>) => Promise<void>;
  deleteColumn: (columnId: string) => Promise<void>;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'notes' | 'organizationId'>) => Promise<void>;
  updateLead: (leadId: string, data: Partial<Lead>) => Promise<void>;
  deleteLead: (leadId: string) => Promise<void>;
  moveLead: (leadId: string, sourceColumnId: string, targetColumnId: string) => Promise<void>;
  addNote: (leadId: string, content: string) => Promise<void>;
  deleteNote: (leadId: string, noteId: string) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  columns: [],
  leads: [],
  loading: false,
  error: null,

  fetchBoard: async () => {
    const user = useAuthStore.getState().user;
    if (!user?.organizationId) return;

    set({ loading: true, error: null });
    try {
      const columnsQuery = query(
        collection(db, 'columns'),
        where('organizationId', '==', user.organizationId)
      );
      const leadsQuery = query(
        collection(db, 'leads'),
        where('organizationId', '==', user.organizationId)
      );

      const [columnsSnapshot, leadsSnapshot] = await Promise.all([
        getDocs(columnsQuery),
        getDocs(leadsQuery)
      ]);

      const columns = columnsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Column[];

      const leads = leadsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Lead[];

      set({ columns, leads, loading: false });
    } catch (error) {
      console.error('Error fetching board:', error);
      set({ error: 'Erro ao carregar o quadro', loading: false });
    }
  },

  addColumn: async (title: string) => {
    const user = useAuthStore.getState().user;
    if (!user?.organizationId) return;

    try {
      const { columns } = get();
      const newColumn: Omit<Column, 'id'> = {
        title,
        order: columns.length,
        backgroundColor: '#f3f4f6',
        organizationId: user.organizationId
      };

      const docRef = await addDoc(collection(db, 'columns'), newColumn);
      set(state => ({
        columns: [...state.columns, { ...newColumn, id: docRef.id }]
      }));
    } catch (error) {
      console.error('Error adding column:', error);
      set({ error: 'Erro ao adicionar coluna' });
    }
  },

  updateColumn: async (columnId: string, data: Partial<Column>) => {
    try {
      await updateDoc(doc(db, 'columns', columnId), data);
      set(state => ({
        columns: state.columns.map(col =>
          col.id === columnId ? { ...col, ...data } : col
        )
      }));
    } catch (error) {
      console.error('Error updating column:', error);
      set({ error: 'Erro ao atualizar coluna' });
    }
  },

  deleteColumn: async (columnId: string) => {
    try {
      await deleteDoc(doc(db, 'columns', columnId));
      set(state => ({
        columns: state.columns.filter(col => col.id !== columnId)
      }));
    } catch (error) {
      console.error('Error deleting column:', error);
      set({ error: 'Erro ao excluir coluna' });
    }
  },

  addLead: async (leadData) => {
    const user = useAuthStore.getState().user;
    if (!user?.organizationId) return;

    try {
      const newLead: Omit<Lead, 'id'> = {
        ...leadData,
        organizationId: user.organizationId,
        createdAt: Date.now(),
        notes: []
      };

      const docRef = await addDoc(collection(db, 'leads'), newLead);
      set(state => ({
        leads: [...state.leads, { ...newLead, id: docRef.id }]
      }));
    } catch (error) {
      console.error('Error adding lead:', error);
      set({ error: 'Erro ao adicionar lead' });
    }
  },

  updateLead: async (leadId: string, data: Partial<Lead>) => {
    try {
      await updateDoc(doc(db, 'leads', leadId), data);
      set(state => ({
        leads: state.leads.map(lead =>
          lead.id === leadId ? { ...lead, ...data } : lead
        )
      }));
    } catch (error) {
      console.error('Error updating lead:', error);
      set({ error: 'Erro ao atualizar lead' });
    }
  },

  deleteLead: async (leadId: string) => {
    try {
      await deleteDoc(doc(db, 'leads', leadId));
      set(state => ({
        leads: state.leads.filter(lead => lead.id !== leadId)
      }));
    } catch (error) {
      console.error('Error deleting lead:', error);
      set({ error: 'Erro ao excluir lead' });
    }
  },

  moveLead: async (leadId: string, sourceColumnId: string, targetColumnId: string) => {
    try {
      // Optimistic update
      set(state => ({
        leads: state.leads.map(lead =>
          lead.id === leadId ? { ...lead, columnId: targetColumnId } : lead
        )
      }));

      await updateDoc(doc(db, 'leads', leadId), {
        columnId: targetColumnId
      });
    } catch (error) {
      console.error('Error moving lead:', error);
      // Revert optimistic update
      set(state => ({
        leads: state.leads.map(lead =>
          lead.id === leadId ? { ...lead, columnId: sourceColumnId } : lead
        ),
        error: 'Erro ao mover lead'
      }));
    }
  },

  addNote: async (leadId: string, content: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const newNote: Note = {
        id: nanoid(),
        content,
        createdAt: Date.now(),
        createdBy: {
          id: user.id,
          name: user.name
        }
      };

      const lead = get().leads.find(l => l.id === leadId);
      if (!lead) throw new Error('Lead not found');

      const updatedNotes = [...(lead.notes || []), newNote];
      
      await updateDoc(doc(db, 'leads', leadId), {
        notes: updatedNotes
      });

      set(state => ({
        leads: state.leads.map(lead =>
          lead.id === leadId ? { ...lead, notes: updatedNotes } : lead
        )
      }));
    } catch (error) {
      console.error('Error adding note:', error);
      set({ error: 'Erro ao adicionar nota' });
    }
  },

  deleteNote: async (leadId: string, noteId: string) => {
    try {
      const lead = get().leads.find(l => l.id === leadId);
      if (!lead) throw new Error('Lead not found');

      const updatedNotes = lead.notes.filter(note => note.id !== noteId);
      
      await updateDoc(doc(db, 'leads', leadId), {
        notes: updatedNotes
      });

      set(state => ({
        leads: state.leads.map(lead =>
          lead.id === leadId ? { ...lead, notes: updatedNotes } : lead
        )
      }));
    } catch (error) {
      console.error('Error deleting note:', error);
      set({ error: 'Erro ao excluir nota' });
    }
  }
}));
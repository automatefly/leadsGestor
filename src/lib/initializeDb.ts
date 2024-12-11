import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { nanoid } from 'nanoid';

const defaultColumns = [
  {
    id: 'novo',
    title: 'Lead Novo',
    order: 0,
    backgroundColor: '#f3f4f6'
  },
  {
    id: 'contratacao',
    title: 'Em Contratação',
    order: 1,
    backgroundColor: '#dbeafe'
  },
  {
    id: 'cliente',
    title: 'Cliente',
    order: 2,
    backgroundColor: '#dcfce7'
  }
];

export const initializeOrganization = async (userId: string, userName: string) => {
  try {
    // Create organization
    const organizationId = nanoid();
    const organization = {
      id: organizationId,
      name: `${userName.split(' ')[0]}'s Organization`,
      ownerId: userId,
      createdAt: Date.now()
    };

    await setDoc(doc(db, 'organizations', organizationId), organization);

    // Create default columns for the organization
    for (const column of defaultColumns) {
      const columnId = nanoid();
      await setDoc(doc(db, 'columns', columnId), {
        ...column,
        id: columnId,
        organizationId
      });
    }

    // Create user document with organization reference
    await setDoc(doc(db, 'users', userId), {
      id: userId,
      email: userName.includes('@') ? userName : null,
      name: userName,
      organizationId
    });

    return organizationId;
  } catch (error) {
    console.error('Error initializing organization:', error);
    throw error;
  }
};
export interface User {
  id: string;
  email: string;
  name: string;
  organizationId?: string;
}

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  createdAt: number;
}

export interface Note {
  id: string;
  content: string;
  createdAt: number;
  createdBy: {
    id: string;
    name: string;
  };
}

export interface Lead {
  id: string;
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  systemValue: number;
  createdAt: number;
  columnId: string;
  organizationId: string;
  notes: Note[];
}

export interface Column {
  id: string;
  title: string;
  order: number;
  backgroundColor?: string;
  organizationId: string;
}
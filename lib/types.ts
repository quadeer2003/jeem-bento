export type BentoItemType = 
  | 'photo' 
  | 'calendar' 
  | 'youtube' 
  | 'links' 
  | 'screenshots' 
  | 'contacts' 
  | 'websites';

export interface BentoItem {
  id: string;
  type: BentoItemType;
  title?: string;
  content: any;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  workspaceId: string;
  isLocked?: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  bentoItemId: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  bentoItemId: string;
}

export interface Link {
  id: string;
  title?: string;
  url: string;
  bentoItemId: string;
}

export interface Screenshot {
  id: string;
  title?: string;
  imageUrl: string;
  bentoItemId: string;
}

export interface Website {
  id: string;
  title?: string;
  url: string;
  bentoItemId: string;
} 
export type MemoryCategory =
  | 'Travel'
  | 'Academia'
  | 'Daily Life'
  | 'Career'
  | 'Personal Growth'
  | 'People'
  | 'Other';

export type MemoryMood =
  | 'Excited'
  | 'Reflective'
  | 'Joyful'
  | 'Calm'
  | 'Nostalgic'
  | 'Proud';

export type MemoryItem = {
  id: string;
  title: string;
  date: string;
  category: MemoryCategory;
  location: string;
  description: string;
  mood: MemoryMood;
  favorite: boolean;
  locked: boolean;
  mediaCount: number;
  people: string[];
  tags: string[];
};

export type DashboardStat = {
  label: string;
  value: string;
  detail: string;
};

import { getSupabaseServerClient } from './supabase/server';
import { redirect } from 'next/navigation';
import type { DashboardStat, MemoryItem } from './types';

export const navItems = [
  { href: '/', label: 'Dashboard', icon: 'home' },
  { href: '/timeline', label: 'Timeline', icon: 'calendar' },
  { href: '/memories', label: 'Memories', icon: 'book' },
  { href: '/travel', label: 'Travel', icon: 'map' },
  { href: '/academia', label: 'Academia', icon: 'graduation-cap' },
];

export async function getMemories(): Promise<MemoryItem[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect('/auth');

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect('/auth');

  const { data } = await supabase.from('memories').select('*').order('memory_date', { ascending: false });
  return (data ?? []).map((memory) => ({
    id: memory.id,
    title: memory.title,
    date: memory.memory_date,
    category: memory.category as MemoryItem['category'],
    location: memory.location,
    description: memory.description,
    mood: memory.mood as MemoryItem['mood'],
    favorite: memory.favorite,
    locked: memory.locked,
    mediaCount: 0,
    people: [],
    tags: [],
  }));
}

export function getDashboardStats(memories: MemoryItem[]): DashboardStat[] {
  return [
    { label: 'Total memories', value: String(memories.length), detail: 'your private archive' },
    { label: 'Travel memories', value: String(memories.filter((memory) => memory.category === 'Travel').length), detail: 'from your archive' },
    { label: 'Academic memories', value: String(memories.filter((memory) => memory.category === 'Academia').length), detail: 'from your archive' },
    { label: 'Favorites', value: String(memories.filter((memory) => memory.favorite).length), detail: 'worth returning to' },
  ];
}

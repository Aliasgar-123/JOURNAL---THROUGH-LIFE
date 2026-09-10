import type { DashboardStat, MemoryItem } from './types';

export const navItems = [
  { href: '/', label: 'Dashboard', icon: 'home' },
  { href: '/timeline', label: 'Timeline', icon: 'calendar' },
  { href: '/memories', label: 'Memories', icon: 'book' },
  { href: '/travel', label: 'Travel', icon: 'map' },
  { href: '/academia', label: 'Academia', icon: 'graduation-cap' },
  { href: '/people', label: 'People', icon: 'users' },
  { href: '/places', label: 'Places', icon: 'pin' },
  { href: '/media', label: 'Media', icon: 'image' },
  { href: '/favorites', label: 'Favorites', icon: 'star' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
];

export const dashboardStats: DashboardStat[] = [
  { label: 'Total memories', value: '248', detail: '+18 this year' },
  { label: 'Travel memories', value: '52', detail: '9 countries' },
  { label: 'Academic memories', value: '33', detail: '3 institutions' },
  { label: 'People remembered', value: '74', detail: 'family and friends' },
];

export const recentMemories: MemoryItem[] = [
  {
    id: '1',
    title: 'First trip to Istanbul',
    date: '2026-03-12',
    category: 'Travel',
    location: 'Istanbul, Türkiye',
    description: 'A city of layered stories, shrinking lanes, and unforgettable family dinners.',
    mood: 'Excited',
    favorite: true,
    locked: false,
    mediaCount: 12,
    people: ['Family', 'Sarah'],
    tags: ['travel', 'family', 'istanbul'],
  },
  {
    id: '2',
    title: 'Graduation day',
    date: '2025-06-18',
    category: 'Academia',
    location: 'London, United Kingdom',
    description: 'A proud academic milestone marked by laughter, robes, and a quiet sense of arrival.',
    mood: 'Proud',
    favorite: true,
    locked: false,
    mediaCount: 8,
    people: ['Friends', 'Mentors'],
    tags: ['graduation', 'achievement'],
  },
  {
    id: '3',
    title: 'Sunday with the family',
    date: '2026-09-02',
    category: 'Daily Life',
    location: 'Surat, India',
    description: 'A simple day, but one that made the years feel especially gentle and full.',
    mood: 'Calm',
    favorite: false,
    locked: false,
    mediaCount: 5,
    people: ['Family'],
    tags: ['family', 'daily-life'],
  },
];

export const timelineEvents = [
  { year: '2026', month: 'September', category: 'Travel', title: 'Road trip to the coast' },
  { year: '2026', month: 'August', category: 'Career', title: 'New role and team milestone' },
  { year: '2025', month: 'June', category: 'Academia', title: 'Graduation and final project showcase' },
  { year: '2024', month: 'December', category: 'Personal Growth', title: 'A year of reflection and reset' },
];

export const countries = [
  'India',
  'UAE',
  'Türkiye',
  'United Kingdom',
  'Italy',
  'France',
  'Japan',
];

export const people = [
  { name: 'Sarah', memories: 42, relationship: 'Friend', highlights: '12 trips, 17 daily memories' },
  { name: 'Aisha', memories: 31, relationship: 'Family', highlights: '8 celebrations, 9 travel moments' },
  { name: 'Yusuf', memories: 26, relationship: 'Colleague', highlights: '5 career milestones' },
];

export const places = [
  { name: 'Istanbul', count: 24, region: 'Türkiye' },
  { name: 'Dubai', count: 16, region: 'UAE' },
  { name: 'Surat', count: 32, region: 'India' },
  { name: 'Oxford', count: 11, region: 'United Kingdom' },
];

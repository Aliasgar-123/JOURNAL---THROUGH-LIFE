'use client';

import Link from 'next/link';
import { BookOpen, CalendarDays, ChevronLeft, ChevronRight, GraduationCap, Heart, Home, Map } from 'lucide-react';
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { navItems } from '@/lib/navigation';
import { LogoutButton } from '@/components/logout-button';

const SidebarCollapsedContext = createContext<{
  collapsed: boolean;
  toggle: () => void;
} | null>(null);

const navigationIcons = {
  home: Home,
  calendar: CalendarDays,
  book: BookOpen,
  heart: Heart,
  map: Map,
  'graduation-cap': GraduationCap,
};

export function JournalSidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  function toggle() {
    setCollapsed((current) => !current);
  }

  return (
    <SidebarCollapsedContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SidebarCollapsedContext.Provider>
  );
}

export function JournalSidebar({
  activeHref,
  dashboard = false,
}: {
  activeHref: string;
  dashboard?: boolean;
}) {
  const sidebar = useContext(SidebarCollapsedContext);
  if (!sidebar) throw new Error('JournalSidebar must be rendered inside JournalSidebarProvider');
  const { collapsed, toggle } = sidebar;
  const FeaturedIcon = dashboard ? Heart : BookOpen;

  return (
    <aside
      className={`hidden shrink-0 flex-col rounded-[30px] border border-[#e7dfd7] bg-[#fbf8f5] shadow-[0_25px_60px_rgba(34,23,17,0.06)] transition-[width,padding] duration-300 lg:flex lg:min-h-[calc(100vh-4rem)] ${
        collapsed ? 'w-[76px] items-center p-3' : 'w-72 p-6'
      }`}
    >
      <div className={`mb-8 flex w-full items-center ${collapsed ? 'flex-col gap-4' : 'justify-between'}`}>
        {!collapsed && (
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[#8c7767]">My Life</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[#1c1917]">Journal</h1>
          </div>
        )}
        {collapsed && (
          <span className="grid size-10 place-items-center rounded-2xl bg-[#efe5dd] font-serif text-xl text-[#5b4b42]" aria-label="Journal">
            J
          </span>
        )}
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="grid size-9 shrink-0 place-items-center rounded-xl text-[#76675d] hover:bg-[#efe5dd] hover:text-[#352d28] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8c7767]"
        >
          {collapsed ? <ChevronRight size={18} aria-hidden="true" /> : <ChevronLeft size={18} aria-hidden="true" />}
        </button>
      </div>

      <nav className="w-full space-y-2" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = navigationIcons[item.icon as keyof typeof navigationIcons];
          const isActive = item.href === activeHref;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={collapsed ? item.label : undefined}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
              className={`flex items-center rounded-2xl py-2.5 text-sm font-medium ${
                collapsed ? 'justify-center px-2.5' : 'justify-start gap-3 px-3'
              } ${
                isActive
                  ? 'bg-[#efe5dd] text-[#1d1d1b]'
                  : 'text-[#584d47] hover:bg-[#f2eae2] hover:text-[#1d1d1b]'
              }`}
            >
              <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
        <div className="pt-2">
          <LogoutButton compact={collapsed} />
        </div>
      </nav>

      {!collapsed && (
        <div className="mt-10 rounded-[28px] bg-[#1f1a17] p-4 text-[#f5efe9]">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#d7c7bb]">
            <FeaturedIcon size={12} />
            Featured
          </div>
          <p className="text-base font-medium leading-6">“Your life, beautifully remembered.”</p>
        </div>
      )}
    </aside>
  );
}

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { navItems } from '@/lib/data';
import { PreserveMemoryButton } from './preserve-memory-button';

export function SiteShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f5f0ea] text-[#1d1d1b]">
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8 lg:px-8">
        <aside className="hidden w-72 shrink-0 rounded-[30px] border border-[#e7dfd7] bg-[#fbf8f5] p-6 shadow-[0_25px_60px_rgba(34,23,17,0.06)] lg:block">
          <div className="mb-8">
            <div className="text-xs uppercase tracking-[0.3em] text-[#8c7767]">My Life</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[#1c1917]">Journal</h1>
          </div>

          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                  item.href === '/' && title === 'Dashboard'
                    ? 'bg-[#efe5dd] text-[#1d1d1b]'
                    : 'text-[#584d47] hover:bg-[#f2eae2] hover:text-[#1d1d1b]'
                }`}
              >
                <span>{item.label}</span>
                {index === 0 && <ArrowRight size={14} />}
              </Link>
            ))}
          </nav>

          <div className="mt-10 rounded-[28px] bg-[#1f1a17] p-4 text-[#f5efe9]">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#d7c7bb]">
              <Sparkles size={12} />
              Featured
            </div>
            <p className="text-base font-medium leading-6">“Your life, beautifully remembered.”</p>
          </div>
        </aside>

        <div className="flex-1 space-y-8">
          <header className="rounded-[30px] border border-[#e7dfd7] bg-[#f9f4f1] p-6 shadow-[0_25px_60px_rgba(34,23,17,0.04)]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[#8c7767]">{subtitle}</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-[-0.07em] text-[#1a1715]">{title}</h2>
              </div>

              <PreserveMemoryButton />
            </div>
          </header>

          {children}
        </div>
      </div>
    </main>
  );
}

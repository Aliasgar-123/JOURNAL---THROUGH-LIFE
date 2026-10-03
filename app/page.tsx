import { ArrowRight, MapPinned, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import { getDashboardStats, getMemories, navItems } from '@/lib/data';
import { PreserveMemoryButton } from '@/components/preserve-memory-button';
import { OnThisDayCard } from '@/components/on-this-day-card';
import { MemoryWall } from '@/components/memory-wall';

export default async function HomePage() {
  const memories = await getMemories();
  const dashboardStats = getDashboardStats(memories);
  const timelineEvents = memories.slice(0, 4).map((memory) => {
    const date = new Date(`${memory.date}T00:00:00`);
    return { year: String(date.getFullYear()), month: date.toLocaleString('en', { month: 'long' }), title: memory.title };
  });
  return (
    <main className="dashboard-canvas min-h-screen text-[#3f403d]">
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
                  index === 0
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
              <Star size={12} />
              Featured
            </div>
            <p className="text-base font-medium leading-6">“Your life, beautifully remembered.”</p>
          </div>
        </aside>

        <div className="flex-1 space-y-8">
          <header className="mb-2 flex flex-col gap-5 border-b border-[#d9d4ca] pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#8b9189]">My little archive</p>
              <h2 className="mt-2 font-serif text-4xl font-normal leading-tight text-[#38403d] sm:text-5xl">
                Moments worth remembering.
              </h2>
              <p className="mt-3 max-w-lg font-sans text-sm leading-6 text-[#7c817c]">
                A quiet collection of places, people and little moments that deserve to stay a little longer.
              </p>
            </div>
            <PreserveMemoryButton />
          </header>

          <section className="grid grid-cols-2 gap-x-5 gap-y-3 border-b border-[#d9d4ca] py-4 sm:grid-cols-4" aria-label="Archive summary">
            {dashboardStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <span className="font-serif text-2xl text-[#38403d]">{stat.value}</span>
                <div>
                  <p className="font-sans text-xs text-[#786c62]">{stat.label}</p>
                  <p className="mt-0.5 font-sans text-[10px] uppercase tracking-[0.1em] text-[#8b7b70]">{stat.detail}</p>
                </div>
                {stat.label === 'Total memories' && <Sparkles size={14} className="ml-auto hidden text-[#9c7d67] sm:block" />}
              </div>
            ))}
          </section>

          <section aria-labelledby="memory-wall-heading">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#8b9189]">Collected along the way</p>
                <h3 id="memory-wall-heading" className="mt-1 font-serif text-2xl font-normal text-[#38403d]">Your memories</h3>
              </div>
              <Link href="/memories" className="pb-1 font-sans text-xs text-[#725f52] underline decoration-[#c8b8a9] underline-offset-4 hover:text-[#3f403d]">
                View archive
              </Link>
            </div>
            <MemoryWall memories={memories} />
          </section>

          <section className="grid gap-8 border-t border-[#d9d4ca] pt-8 xl:grid-cols-[1fr_0.9fr]">
            <OnThisDayCard memories={memories.map(({ id, title, date, category, description, favorite }) => ({ id, title, date, category, description, favorite }))} />

            <div className="border-t border-[#d9d4ca] pt-6 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-serif text-xl font-normal text-[#38403d]">Timeline</h3>
                <MapPinned size={17} className="text-[#7b6a5e]" />
              </div>

              <div className="space-y-4">
                {timelineEvents.length === 0 && <p className="font-sans text-sm text-[#685d56]">Your timeline will appear here as you add memories.</p>}
                {timelineEvents.map((event) => (
                  <div key={`${event.year}-${event.month}-${event.title}`} className="border-l border-[#d9c8bf] pl-4">
                    <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#8a7769]">{event.year}</div>
                    <div className="mt-1 font-sans text-xs text-[#4a403b]">{event.month}</div>
                    <div className="mt-1 font-serif text-base text-[#201d1b]">{event.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

import { ArrowRight, CalendarDays, Heart, Lock, MapPinned, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import { getDashboardStats, getMemories, navItems } from '@/lib/data';
import { PreserveMemoryButton } from '@/components/preserve-memory-button';

export default async function HomePage() {
  const memories = await getMemories();
  const dashboardStats = getDashboardStats(memories);
  const recentMemories = memories.slice(0, 3);
  const timelineEvents = memories.slice(0, 4).map((memory) => {
    const date = new Date(`${memory.date}T00:00:00`);
    return { year: String(date.getFullYear()), month: date.toLocaleString('en', { month: 'long' }), title: memory.title };
  });
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
          <header className="rounded-[30px] border border-[#e7dfd7] bg-[#f9f4f1] p-6 shadow-[0_25px_60px_rgba(34,23,17,0.04)]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[#8c7767]">Your private archive</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-[-0.07em] text-[#1a1715]">
                  Your life, beautifully remembered.
                </h2>
              </div>

              <PreserveMemoryButton />
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dashboardStats.map((stat) => (
              <div key={stat.label} className="rounded-[24px] border border-[#e7dfd7] bg-[#fbf8f5] p-5 shadow-sm">
                <p className="text-sm text-[#786c62]">{stat.label}</p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-3xl font-semibold tracking-[-0.06em] text-[#1d1d1b]">{stat.value}</span>
                  <Sparkles size={18} className="text-[#9c7d67]" />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#8b7b70]">{stat.detail}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-8 xl:grid-cols-[1.5fr_0.9fr]">
            <div className="rounded-[30px] border border-[#e7dfd7] bg-[#faf6f3] p-6 shadow-[0_25px_60px_rgba(34,23,17,0.04)]">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-2xl font-semibold tracking-[-0.05em] text-[#1a1715]">Recent memories</h3>
                <Link href="/memories" className="text-sm font-medium text-[#725f52]">
                  View all
                </Link>
              </div>

              <div className="space-y-4">
                {recentMemories.map((memory) => (
                  <article key={memory.id} className="rounded-[26px] border border-[#efe4dc] bg-white p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#8a7769]">
                          <CalendarDays size={12} />
                          {memory.category}
                        </div>
                        <h4 className="text-xl font-semibold tracking-[-0.04em] text-[#1c1917]">{memory.title}</h4>
                        <p className="mt-2 text-sm text-[#685d56]">{memory.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {memory.favorite && <Star size={16} className="fill-[#d1a35f] text-[#d1a35f]" />}
                        {memory.locked && <Lock size={16} className="text-[#7a5b45]" />}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-[#524a45]">{memory.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {memory.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-[#f2eae2] px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-[#6d5c52]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="rounded-[30px] border border-[#e7dfd7] bg-[#f7f1ec] p-6 shadow-[0_25px_60px_rgba(34,23,17,0.04)]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold tracking-[-0.05em] text-[#1a1715]">On this day</h3>
                  <Heart size={18} className="text-[#d46f6b]" />
                </div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#8a7769]">3 years ago</p>
                <h4 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#1d1d1b]">A quiet evening in Dubai</h4>
                <p className="mt-3 text-sm leading-6 text-[#544b45]">
                  A mild wind, warm conversation, and a skyline that felt like a promise for everything still to come.
                </p>
              </div>

              <div className="rounded-[30px] border border-[#e7dfd7] bg-[#f9f4f1] p-6 shadow-[0_25px_60px_rgba(34,23,17,0.04)]">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-xl font-semibold tracking-[-0.05em] text-[#1a1715]">Timeline</h3>
                  <MapPinned size={18} className="text-[#7b6a5e]" />
                </div>

                <div className="space-y-4">
                  {timelineEvents.length === 0 && <p className="text-sm text-[#685d56]">Your timeline will appear here as you add memories.</p>}
                  {timelineEvents.map((event) => (
                    <div key={`${event.year}-${event.month}-${event.title}`} className="border-l border-[#d9c8bf] pl-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-[#8a7769]">{event.year}</div>
                      <div className="mt-1 text-sm font-medium text-[#4a403b]">{event.month}</div>
                      <div className="mt-2 rounded-xl bg-white px-3 py-2 text-sm text-[#201d1b] shadow-sm">
                        {event.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

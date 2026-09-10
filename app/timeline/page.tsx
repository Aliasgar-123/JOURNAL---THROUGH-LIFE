import { SiteShell } from '@/components/site-shell';
import { timelineEvents } from '@/lib/data';

export default function TimelinePage() {
  return (
    <SiteShell title="Life timeline" subtitle="Chronological archive">
      <div className="grid gap-6 md:grid-cols-2">
        {timelineEvents.map((event) => (
          <article key={`${event.year}-${event.title}`} className="rounded-[28px] border border-[#e7dfd7] bg-[#fffdfb] p-6 shadow-sm">
            <div className="text-xs uppercase tracking-[0.3em] text-[#8d7b6f]">{event.year}</div>
            <div className="mt-3 text-lg font-medium text-[#4d443f]">{event.month}</div>
            <div className="mt-4 rounded-2xl bg-[#f3ebdf] px-3 py-2 text-sm font-medium text-[#241f1d]">
              {event.category}
            </div>
            <h3 className="mt-5 text-2xl font-semibold tracking-[-0.045em] text-[#1e1a18]">{event.title}</h3>
          </article>
        ))}
      </div>
    </SiteShell>
  );
}

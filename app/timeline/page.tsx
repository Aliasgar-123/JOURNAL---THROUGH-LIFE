import { SiteShell } from '@/components/site-shell';
import { getMemories } from '@/lib/data';

export default async function TimelinePage() {
  const memories = await getMemories();
  return (
    <SiteShell title="Life timeline" subtitle="Chronological archive">
      <div className="grid gap-6 md:grid-cols-2">
        {memories.map((memory) => {
          const date = new Date(`${memory.date}T00:00:00`);
          return (
          <article key={memory.id} className="rounded-[28px] border border-[#e7dfd7] bg-[#fffdfb] p-6 shadow-sm">
            <div className="text-xs uppercase tracking-[0.3em] text-[#8d7b6f]">{date.getFullYear()}</div>
            <div className="mt-3 text-lg font-medium text-[#4d443f]">{date.toLocaleString('en', { month: 'long' })}</div>
            <div className="mt-4 rounded-2xl bg-[#f3ebdf] px-3 py-2 text-sm font-medium text-[#241f1d]">
              {memory.category}
            </div>
            <h3 className="mt-5 text-2xl font-semibold tracking-[-0.045em] text-[#1e1a18]">{memory.title}</h3>
          </article>
          );
        })}
        {memories.length === 0 && <p className="text-sm text-[#685d56]">Your timeline is empty.</p>}
      </div>
    </SiteShell>
  );
}

import { SiteShell } from '@/components/site-shell';
import { getMemories } from '@/lib/data';

export default async function AcademiaPage() {
  const memories = (await getMemories()).filter((memory) => memory.category === 'Academia');
  return (
    <SiteShell title="Academia" subtitle="Education and achievements">
      <div className="grid gap-6 md:grid-cols-3">
        {memories.map((memory) => (
          <article key={memory.id} className="rounded-[28px] border border-[#e7dfd7] bg-[#fffdfb] p-6 shadow-sm">
            <div className="text-xs uppercase tracking-[0.22em] text-[#8c7a6d]">{memory.date}</div>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-[#1d1a18]">{memory.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[#504a46]">{memory.description}</p>
          </article>
        ))}
        {memories.length === 0 && <p className="text-sm text-[#685d56]">Academic memories will appear here when you add them.</p>}
      </div>
    </SiteShell>
  );
}

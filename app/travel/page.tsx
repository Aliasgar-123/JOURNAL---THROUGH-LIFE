import { SiteShell } from '@/components/site-shell';
import { countries, recentMemories } from '@/lib/data';

export default function TravelPage() {
  return (
    <SiteShell title="Travel" subtitle="Places, routes, and memories">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-[#e7dfd7] bg-[#f8f3f0] p-6 shadow-sm">
          <h3 className="text-2xl font-semibold tracking-[-0.05em] text-[#1d1a18]">Countries visited</h3>
          <div className="mt-5 space-y-3">
            {countries.map((country) => (
              <div key={country} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-[#2b2624] shadow-sm">
                <span>{country}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-[#7d6a5d]">Archive</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {recentMemories
            .filter((memory) => memory.category === 'Travel')
            .map((memory) => (
              <article key={memory.id} className="rounded-[28px] border border-[#e7dfd7] bg-[#fffdfb] p-6 shadow-sm">
                <div className="text-xs uppercase tracking-[0.2em] text-[#8f7b6e]">{memory.location}</div>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#1d1a18]">{memory.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#554d49]">{memory.description}</p>
              </article>
            ))}
        </div>
      </div>
    </SiteShell>
  );
}

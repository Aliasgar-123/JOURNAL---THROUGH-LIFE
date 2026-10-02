import Image from 'next/image';
import { SiteShell } from '@/components/site-shell';
import { getMemories } from '@/lib/data';

export default async function MemoriesPage() {
  const recentMemories = await getMemories();
  return (
    <SiteShell title="Memories" subtitle="Your private archive">
      <div className="space-y-4">
        {recentMemories.length === 0 && <p className="rounded-[28px] border border-[#e7dfd7] bg-[#fffdfb] p-6 text-sm text-[#685d56]">No memories yet. Use “Preserve this memory” to add your first one.</p>}
        {recentMemories.map((memory) => (
          <article key={memory.id} className="rounded-[28px] border border-[#e7dfd7] bg-[#fffdfb] p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-[#8f7b6e]">{memory.category}</div>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#1d1a18]">{memory.title}</h3>
              </div>
              <span className="rounded-full bg-[#f2eae2] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#5a4a42]">
                {memory.favorite ? 'Favorite' : 'Saved'}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#554d49]">{memory.description}</p>
            {memory.media.length > 0 && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {memory.media.map((image) => (
                  <figure key={image.id} className="overflow-hidden rounded-2xl border border-[#e7dfd7] bg-[#f8f3ee]">
                    <div className="relative aspect-[4/3] w-full">
                      <Image src={image.url} alt={image.caption || memory.title} fill sizes="(max-width: 640px) 100vw, 50vw" unoptimized className="object-cover" />
                    </div>
                    {image.caption && <figcaption className="px-3 py-2 text-sm text-[#554d49]">{image.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              {memory.people.map((person) => (
                <span key={person} className="rounded-full border border-[#e4d3c6] px-2.5 py-1 text-xs text-[#584f49]">{person}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </SiteShell>
  );
}

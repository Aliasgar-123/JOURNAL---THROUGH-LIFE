import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { EditMemoryButton } from '@/components/edit-memory-button';
import { DeleteMemoryButton } from '@/components/delete-memory-button';
import { FavoriteMemoryButton } from '@/components/favorite-memory-button';
import { getMemories } from '@/lib/data';

export default async function AcademiaPage() {
  const memories = (await getMemories()).filter((memory) => memory.category === 'Academia');
  return (
    <SiteShell title="Academia" subtitle="Education and achievements" memoryCategory="Academia">
      <div className="space-y-4">
        {memories.length === 0 && <p className="rounded-[28px] border border-[#e7dfd7] bg-[#fffdfb] p-6 text-sm text-[#685d56]">Academic memories will appear here when you add them.</p>}
        {memories.map((memory) => (
          <article key={memory.id} className="rounded-[28px] border border-[#e7dfd7] bg-[#fffdfb] p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-[#8f7b6e]">{memory.category}</div>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#1d1a18]">
                  <Link href={`/memory/${memory.id}`} className="hover:underline hover:decoration-[#c8b8a9] hover:underline-offset-4">
                    {memory.title}
                  </Link>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#f2eae2] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#5a4a42]">
                  {memory.favorite ? 'Favorite' : 'Saved'}
                </span>
                <EditMemoryButton memory={memory} />
                <DeleteMemoryButton memory={memory} />
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#554d49]">{memory.description}</p>
            {memory.location && (
              <p className="mt-3 flex items-center gap-2 text-sm text-[#7d6a5d]">
                <MapPin size={15} aria-hidden="true" />
                <span>{memory.location}</span>
              </p>
            )}
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
            <div className="mt-3">
              <FavoriteMemoryButton memory={memory} />
            </div>
          </article>
        ))}
      </div>
    </SiteShell>
  );
}

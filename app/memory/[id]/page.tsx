import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/site-shell';
import { FavoriteMemoryButton } from '@/components/favorite-memory-button';
import { getMemories } from '@/lib/data';

export default async function MemoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const memories = await getMemories();
  const memory = memories.find((item) => item.id === id);
  if (!memory) notFound();

  const date = new Date(`${memory.date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const archiveHref = memory.category === 'Travel' ? '/travel' : '/memories';

  return (
    <SiteShell
      title={memory.title}
      subtitle={`${memory.category} · ${date}`}
      memoryCategory={memory.category === 'Travel' ? 'Travel' : undefined}
    >
      <article className="rounded-[28px] border border-[#e7dfd7] bg-[#fffdfb] p-6 shadow-sm">
        <Link href={archiveHref} className="inline-flex items-center gap-2 text-sm text-[#725f52] hover:text-[#3f403d]">
          <ArrowLeft size={16} />
          Back to {memory.category === 'Travel' ? 'Travel' : 'Memories'}
        </Link>

        {memory.location && (
          <p className="mt-5 flex items-center gap-2 text-sm text-[#7d6a5d]">
            <MapPin size={16} aria-hidden="true" />
            <span>{memory.location}</span>
          </p>
        )}
        {memory.description && <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[#554d49]">{memory.description}</p>}

        {memory.media.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {memory.media.map((photo) => (
              <figure key={photo.id} className="overflow-hidden rounded-2xl border border-[#e7dfd7] bg-[#f8f3ee]">
                <div className="relative aspect-[4/3] w-full">
                  <Image src={photo.url} alt={photo.caption || memory.title} fill sizes="(max-width: 640px) 100vw, 50vw" unoptimized className="object-cover" />
                </div>
                {photo.caption && <figcaption className="px-3 py-2 text-sm text-[#554d49]">{photo.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
        <div className="mt-5">
          <FavoriteMemoryButton memory={memory} />
        </div>
      </article>
    </SiteShell>
  );
}
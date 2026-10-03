'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, Lock, Star } from 'lucide-react';
import { useState } from 'react';
import type { MemoryItem } from '@/lib/types';

function MemoryCard({ memory, index }: { memory: MemoryItem; index: number }) {
  const [activePhoto, setActivePhoto] = useState(0);
  const photoCount = memory.media.length;
  const photo = memory.media[activePhoto];
  const date = new Date(`${memory.date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  function showPreviousPhoto() {
    setActivePhoto((current) => (current - 1 + photoCount) % photoCount);
  }

  function showNextPhoto() {
    setActivePhoto((current) => (current + 1) % photoCount);
  }

  return (
    <article
      className={`group relative bg-[#fffdf8] p-3 pb-5 shadow-[0_14px_35px_rgba(74,69,61,0.13)] transition duration-300 hover:z-10 hover:-translate-y-2 hover:rotate-0 hover:scale-[1.02] hover:shadow-[0_24px_50px_rgba(74,69,61,0.2)] ${
        index % 6 === 0 ? '-rotate-2' :
        index % 6 === 1 ? 'mt-5 rotate-[1.5deg]' :
        index % 6 === 2 ? '-rotate-1' :
        index % 6 === 3 ? '-mt-1 rotate-[1.7deg]' :
        index % 6 === 4 ? 'mt-6 -rotate-[1.5deg]' : 'rotate-2'
      }`}
    >
      <div className="absolute left-1/2 top-2 z-10 h-[22px] w-[76px] -translate-x-1/2 -rotate-2 bg-[rgba(220,202,164,0.72)]" aria-hidden="true" />
      <div className="relative aspect-square overflow-hidden bg-[#e5e0d7] sm:aspect-[4/3]">
        {photo ? (
          <Image
            src={photo.url}
            alt={photo.caption || memory.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
            className="object-cover transition duration-700 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-8 text-center font-serif text-lg text-[#91877d]">
            A moment waiting for its photograph
          </div>
        )}
        {photoCount > 1 && (
          <>
            <button
              type="button"
              onClick={showPreviousPhoto}
              aria-label={`Previous photo for ${memory.title}`}
              className="absolute left-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-[#fffdf8]/90 text-[#46443f] shadow-sm hover:bg-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={showNextPhoto}
              aria-label={`Next photo for ${memory.title}`}
              className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-[#fffdf8]/90 text-[#46443f] shadow-sm hover:bg-white"
            >
              <ChevronRight size={18} />
            </button>
            <span className="absolute bottom-2 right-2 rounded-full bg-[#292a27]/70 px-2 py-1 font-sans text-[10px] text-white" aria-live="polite">
              {activePhoto + 1} / {photoCount}
            </span>
          </>
        )}
      </div>

      <div className="px-2 pt-4">
        <div className="font-sans text-[10px] uppercase tracking-[0.12em] text-[#92948e]">{date}</div>
        <div className="mt-1 flex items-start justify-between gap-2">
          <h3 className="font-serif text-xl font-medium leading-tight text-[#404541]">{memory.title}</h3>
          <span className="flex shrink-0 items-center gap-2 pt-1">
            {memory.favorite && <Star size={14} className="fill-[#d1a35f] text-[#b88d50]" aria-label="Favorite" />}
            {memory.locked && <Lock size={14} className="text-[#7a685d]" aria-label="Private" />}
          </span>
        </div>
        {memory.description && <p className="mt-2 font-sans text-xs leading-[1.55] text-[#858881]">{memory.description}</p>}
        {memory.location && (
          <div className="mt-3 flex items-center gap-1.5 font-sans text-[10px] text-[#92948e]">
            <Heart size={11} className="text-[#bd8377]" />
            <span>{memory.location}</span>
          </div>
        )}
      </div>
    </article>
  );
}

export function MemoryWall({ memories }: { memories: MemoryItem[] }) {
  if (memories.length === 0) {
    return <p className="py-10 text-center font-sans text-sm text-[#7c817c]">Your archive is ready for its first memory.</p>;
  }

  return (
    <div className="grid grid-cols-1 items-start gap-x-7 gap-y-9 sm:grid-cols-2 2xl:grid-cols-3">
      {memories.map((memory, index) => <MemoryCard key={memory.id} memory={memory} index={index} />)}
    </div>
  );
}
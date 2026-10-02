'use client';

import { Heart } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';
import type { MemoryItem } from '@/lib/types';

type OnThisDayMemory = Pick<MemoryItem, 'id' | 'title' | 'date' | 'category' | 'description'>;

function subscribeToDate() {
  return () => {};
}

function getLocalDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function getServerDate() {
  return '';
}

export function OnThisDayCard({ memories }: { memories: OnThisDayMemory[] }) {
  const today = useSyncExternalStore(subscribeToDate, getLocalDate, getServerDate);
  const [selectedYearsAgo, setSelectedYearsAgo] = useState('');

  const availableYears = today
    ? [...new Set(memories
      .filter((memory) => memory.date.slice(5) === today.slice(5))
      .map((memory) => Number(today.slice(0, 4)) - Number(memory.date.slice(0, 4)))
      .filter((yearsAgo) => yearsAgo > 0))].sort((left, right) => left - right)
    : [];
  const activeYearsAgo = Number(selectedYearsAgo || availableYears[0] || 0);
  const targetYear = today ? Number(today.slice(0, 4)) - activeYearsAgo : 0;
  const anniversaryMemories = memories.filter(
    (memory) => memory.date.slice(5) === today.slice(5) && Number(memory.date.slice(0, 4)) === targetYear,
  );

  return (
    <section className="rounded-[30px] border border-[#e7dfd7] bg-[#f7f1ec] p-6 shadow-[0_25px_60px_rgba(34,23,17,0.04)]" aria-labelledby="on-this-day-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 id="on-this-day-title" className="text-xl font-semibold tracking-[-0.05em] text-[#1a1715]">On this day</h3>
          <Heart size={18} className="text-[#d46f6b]" />
        </div>
        <label className="flex items-center gap-2 text-sm text-[#685d56]">
          <span className="sr-only">Choose anniversary year</span>
          <select
            value={selectedYearsAgo || String(availableYears[0] || '')}
            onChange={(event) => setSelectedYearsAgo(event.target.value)}
            disabled={!today || availableYears.length === 0}
            className="max-w-full rounded-xl border border-[#dfd1c7] bg-[#fffdfb] px-3 py-2 text-sm text-[#403630] outline-none focus:border-[#8c7767] disabled:text-[#8a7d74]"
          >
            {!today && <option value="">Loading...</option>}
            {today && availableYears.length === 0 && <option value="">No anniversaries yet</option>}
            {availableYears.map((yearsAgo) => (
              <option key={yearsAgo} value={yearsAgo}>
                {yearsAgo} {yearsAgo === 1 ? 'year' : 'years'} ago
              </option>
            ))}
          </select>
        </label>
      </div>

      {!today ? (
        <p className="text-sm leading-6 text-[#544b45]">Finding memories from this day...</p>
      ) : anniversaryMemories.length === 0 ? (
        <p className="text-sm leading-6 text-[#544b45]">No memories from this day in past years yet.</p>
      ) : (
        <div className="space-y-4">
          {anniversaryMemories.map((memory) => (
            <article key={memory.id} className="border-t border-[#e4d7ce] pt-4 first:border-0 first:pt-0">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8a7769]">{memory.category} · {memory.date}</p>
              <h4 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#1d1d1b]">{memory.title}</h4>
              {memory.description && <p className="mt-3 text-sm leading-6 text-[#544b45]">{memory.description}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
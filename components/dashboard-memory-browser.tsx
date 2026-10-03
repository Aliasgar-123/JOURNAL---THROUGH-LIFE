'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MemoryWall } from '@/components/memory-wall';
import type { MemoryItem } from '@/lib/types';

function formatMonth(month: string) {
  return new Date(Date.UTC(2026, Number(month) - 1, 1)).toLocaleDateString('en', {
    month: 'long',
    timeZone: 'UTC',
  });
}

export function DashboardMemoryBrowser({ memories }: { memories: MemoryItem[] }) {
  const years = [...new Set(memories.map((memory) => memory.date.slice(0, 4)))].sort((left, right) => right.localeCompare(left));
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const activeYear = years.includes(selectedYear) ? selectedYear : years[0] ?? '';
  const months = [...new Set(memories
    .filter((memory) => memory.date.startsWith(`${activeYear}-`))
    .map((memory) => memory.date.slice(5, 7)))].sort((left, right) => right.localeCompare(left));
  const activeMonth = months.includes(selectedMonth) ? selectedMonth : months[0] ?? '';
  const activeMemories = memories.filter((memory) => memory.date.startsWith(`${activeYear}-${activeMonth}`));

  return (
    <section aria-labelledby="memory-wall-heading">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#8b9189]">Collected along the way</p>
          <h3 id="memory-wall-heading" className="mt-1 font-serif text-2xl font-normal text-[#38403d]">Your memories</h3>
        </div>
        <Link href="/memories" className="pb-1 font-sans text-xs text-[#725f52] underline decoration-[#c8b8a9] underline-offset-4 hover:text-[#3f403d]">
          View archive
        </Link>
      </div>

      {years.length > 0 && (
        <div className="mb-7 flex flex-wrap items-end gap-3 border-b border-[#d9d4ca] pb-5">
          <label className="block font-sans text-xs text-[#786c62]">
            Year
            <select
              value={activeYear}
              onChange={(event) => {
                setSelectedYear(event.target.value);
                setSelectedMonth('');
              }}
              className="mt-1 block min-w-32 rounded-xl border border-[#dfd1c7] bg-[#fffdfb] px-3 py-2.5 text-sm text-[#403630] outline-none focus:border-[#8c7767]"
            >
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </label>
          <label className="block font-sans text-xs text-[#786c62]">
            Month
            <select
              value={activeMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              disabled={months.length === 0}
              className="mt-1 block min-w-40 rounded-xl border border-[#dfd1c7] bg-[#fffdfb] px-3 py-2.5 text-sm text-[#403630] outline-none focus:border-[#8c7767] disabled:opacity-60"
            >
              {months.map((month) => <option key={month} value={month}>{formatMonth(month)}</option>)}
            </select>
          </label>
          <p className="ml-auto pb-2 font-sans text-xs text-[#8b7b70]">
            {formatMonth(activeMonth)} {activeYear} · {activeMemories.length} {activeMemories.length === 1 ? 'memory' : 'memories'}
          </p>
        </div>
      )}

      {years.length === 0
        ? <p className="py-10 text-center font-sans text-sm text-[#7c817c]">Your archive is ready for its first memory.</p>
        : <MemoryWall memories={activeMemories} />}
    </section>
  );
}
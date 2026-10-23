import Image from 'next/image';
import Link from 'next/link';
import { Folder, Image as ImageIcon } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { CreateTripButton } from '@/components/create-trip-button';
import { TravelMemoryList } from '@/components/travel-memory-list';
import { getMemories, getTrips } from '@/lib/data';

export default async function TravelPage() {
  const [trips, memories] = await Promise.all([getTrips(), getMemories()]);
  const ungroupedMemories = memories.filter((memory) => memory.category === 'Travel' && !memory.tripId);
  const tripsWithPhotos = trips.map((trip) => ({
    ...trip,
    coverPhotos: memories
      .filter((memory) => memory.tripId === trip.id)
      .flatMap((memory) => memory.media)
      .slice(0, 3),
  }));

  return (
    <SiteShell title="Travel" subtitle="Places, routes, and memories" hideCreateMemoryButton>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d9d4ca] pb-5">
          <p className="max-w-xl text-sm leading-6 text-[#685d56]">Create a trip folder for a place, then keep all its moments together.</p>
          <CreateTripButton />
        </div>

        {trips.length === 0 ? (
          <p className="rounded-[24px] border border-[#e7dfd7] bg-[#fffdfb] p-6 text-sm text-[#685d56]">No trip folders yet. Add a trip to start your travel archive.</p>
        ) : (
          <section aria-label="Trip folders" className="grid grid-cols-[repeat(auto-fill,minmax(124px,1fr))] gap-x-3 gap-y-4">
            {tripsWithPhotos.map((trip) => (
              <Link
                key={trip.id}
                href={`/travel/${trip.id}`}
                className="group flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg border border-transparent px-3 py-4 text-center transition hover:border-[#e7dfd7] hover:bg-[#fffdfb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8c7767]"
              >
                <span className="relative grid size-20 shrink-0 place-items-center" aria-hidden="true">
                  {trip.coverPhotos.length > 0 ? (
                    <span className="absolute left-1/2 top-5 z-10 flex -translate-x-1/2 items-center gap-0.5 transition group-hover:-translate-y-1">
                      {trip.coverPhotos.map((photo) => (
                        <span key={photo.id} className={`relative h-7 overflow-hidden rounded-[2px] border border-white bg-white shadow-sm ${trip.coverPhotos.length === 1 ? 'w-12' : 'w-6'}`}>
                          <Image src={photo.url} alt="" fill sizes="48px" unoptimized className="object-cover" />
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="absolute left-1/2 top-5 z-10 grid size-8 -translate-x-1/2 place-items-center rounded-sm border border-[#d8d1c7] bg-white text-[#907d64] shadow-sm transition group-hover:-translate-y-1">
                      <ImageIcon size={17} strokeWidth={1.5} />
                    </span>
                  )}
                  <Folder size={76} strokeWidth={1.4} className="relative z-0 fill-[#f2c85d] text-[#a77a22] drop-shadow-[0_3px_2px_rgba(84,61,22,0.16)]" />
                </span>
                <span className="min-w-0 w-full">
                  <span title={trip.name} className="block truncate text-sm font-medium text-[#1d1a18]">{trip.name}</span>
                  <span className="mt-0.5 block text-xs text-[#786c62]">{trip.memoryCount} {trip.memoryCount === 1 ? 'memory' : 'memories'}</span>
                </span>
              </Link>
            ))}
          </section>
        )}

        {ungroupedMemories.length > 0 && (
          <section className="space-y-4 border-t border-[#d9d4ca] pt-7" aria-labelledby="ungrouped-travel-heading">
            <div>
              <h3 id="ungrouped-travel-heading" className="text-xl font-semibold text-[#1d1a18]">Other travel memories</h3>
              <p className="mt-1 text-sm text-[#786c62]">These older memories are not assigned to a trip folder.</p>
            </div>
            <TravelMemoryList memories={ungroupedMemories} emptyMessage="No other travel memories." />
          </section>
        )}
      </div>
    </SiteShell>
  );
}

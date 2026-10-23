import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
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
          <section aria-label="Trip folders" className="folder-grid">
            {tripsWithPhotos.map((trip) => (
              <Link
                key={trip.id}
                href={`/travel/${trip.id}`}
                className="trip-folder"
              >
                <span className="folder-art" aria-hidden="true">
                  <span className="folder-back" />
                  {trip.coverPhotos.slice(0, 3).map((photo, index) => (
                    <span key={photo.id} className={`folder-photo photo-${['one', 'two', 'three'][index]}`}>
                      <span className="folder-photo-image">
                        <Image src={photo.url} alt="" fill sizes="55px" unoptimized />
                      </span>
                    </span>
                  ))}
                  <span className="folder-front" />
                </span>
                <span className="folder-name">{trip.name}</span>
                <span className="folder-meta">
                  {trip.memoryCount} {trip.memoryCount === 1 ? 'memory' : 'memories'} · Open folder <ArrowUpRight size={11} aria-hidden="true" />
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

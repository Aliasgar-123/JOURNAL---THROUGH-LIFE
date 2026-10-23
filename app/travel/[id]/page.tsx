import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/site-shell';
import { TravelMemoryList } from '@/components/travel-memory-list';
import { getMemories, getTrips } from '@/lib/data';

export default async function TravelTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [trips, memories] = await Promise.all([getTrips(), getMemories()]);
  const trip = trips.find((item) => item.id === id);
  if (!trip) notFound();

  const tripMemories = memories.filter((memory) => memory.tripId === trip.id);

  return (
    <SiteShell title={trip.name} subtitle="Trip folder" memoryCategory="Travel" tripId={trip.id}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d9d4ca] pb-5">
          <Link href="/travel" className="inline-flex items-center gap-2 text-sm text-[#725f52] hover:text-[#3f403d]">
            <ArrowLeft size={16} aria-hidden="true" />
            All trips
          </Link>
          <p className="text-sm text-[#786c62]">{trip.memoryCount} {trip.memoryCount === 1 ? 'memory' : 'memories'}</p>
        </div>
        <TravelMemoryList memories={tripMemories} emptyMessage="This trip folder is empty. Add a memory to start collecting moments from this trip." />
      </div>
    </SiteShell>
  );
}

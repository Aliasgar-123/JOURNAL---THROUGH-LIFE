import { MemoryWall } from '@/components/memory-wall';
import { SiteShell } from '@/components/site-shell';
import { getMemories } from '@/lib/data';

export default async function FavoritesPage() {
  const favorites = (await getMemories()).filter((memory) => memory.favorite);
  return (
    <SiteShell title="Favorites" subtitle="Memories to return to">
      {favorites.length === 0
        ? <p className="rounded-[28px] border border-[#e7dfd7] bg-[#fffdfb] p-6 text-sm text-[#685d56]">No favorite memories yet.</p>
        : <MemoryWall memories={favorites} />}
    </SiteShell>
  );
}
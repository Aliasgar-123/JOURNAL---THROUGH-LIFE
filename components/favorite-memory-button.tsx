'use client';

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { MemoryItem } from '@/lib/types';

type FavoriteMemory = Pick<MemoryItem, 'id' | 'title' | 'favorite'>;

export function FavoriteMemoryButton({ memory }: { memory: FavoriteMemory }) {
  const router = useRouter();
  const [favoriteOverride, setFavoriteOverride] = useState<{ base: boolean; value: boolean } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const isFavorite = favoriteOverride?.base === memory.favorite ? favoriteOverride.value : memory.favorite;

  async function toggleFavorite() {
    if (isUpdating) return;
    const nextFavorite = !isFavorite;
    setFavoriteOverride({ base: memory.favorite, value: nextFavorite });
    setIsUpdating(true);
    setError('');

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setFavoriteOverride(null);
      setError('Please sign in to update favorites.');
      setIsUpdating(false);
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setFavoriteOverride(null);
      setError('Please sign in to update favorites.');
      setIsUpdating(false);
      return;
    }

    const { error: updateError } = await supabase.from('memories').update({ favorite: nextFavorite }).eq('id', memory.id);
    if (updateError) {
      setFavoriteOverride(null);
      setError(updateError.message);
    } else {
      router.refresh();
    }
    setIsUpdating(false);
  }

  return (
    <span className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={toggleFavorite}
        disabled={isUpdating}
        aria-label={isFavorite ? `Remove ${memory.title} from favorites` : `Add ${memory.title} to favorites`}
        aria-pressed={isFavorite}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        className={`grid size-9 shrink-0 place-items-center rounded-full transition hover:bg-[#f9e4df] disabled:opacity-60 ${isFavorite ? 'text-[#c65f64]' : 'text-[#8b817b] hover:text-[#c65f64]'}`}
      >
        <Heart size={17} className={isFavorite ? 'fill-current' : ''} />
      </button>
      {error && <span role="alert" className="sr-only">{error}</span>}
    </span>
  );
}
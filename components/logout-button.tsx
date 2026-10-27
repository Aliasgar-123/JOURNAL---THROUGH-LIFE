'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState('');

  async function handleSignOut() {
    setIsSigningOut(true);
    setError('');
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError('Unable to connect to your account. Try again.');
      setIsSigningOut(false);
      return;
    }

    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      setIsSigningOut(false);
      return;
    }

    router.replace('/auth');
    router.refresh();
  }

  return (
    <div className={`flex w-full flex-col gap-1 ${compact ? 'items-center' : 'items-end'}`}>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        aria-label={compact ? (isSigningOut ? 'Signing out' : 'Log out') : undefined}
        title={compact ? (isSigningOut ? 'Signing out' : 'Log out') : undefined}
        className={`inline-flex w-full items-center justify-center gap-2 border border-[#d9d0c8] text-sm font-medium text-[#584d47] hover:bg-[#efe5dd] disabled:opacity-60 ${
          compact ? 'size-11 rounded-2xl p-0' : 'rounded-full px-4 py-3'
        }`}
      >
        <LogOut size={16} />
        {!compact && (isSigningOut ? 'Signing out...' : 'Log out')}
      </button>
      {error && <p role="alert" className="max-w-48 text-right text-xs text-[#8c3f35]">{error}</p>}
    </div>
  );
}
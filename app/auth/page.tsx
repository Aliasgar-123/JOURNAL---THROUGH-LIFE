'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-up');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError('Supabase is not configured. Add the public URL and publishable key to .env.local.');
    } else {
      const result = mode === 'sign-up'
        ? await supabase.auth.signUp({ email, password, options: { data: { full_name: formData.get('name') } } })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) setError(result.error.message);
      else if (mode === 'sign-up') setMessage('Check your email to confirm your account, then sign in.');
      else router.push('/');
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f0ea] px-6 py-12 text-[#1d1d1b]">
      <section className="w-full max-w-md rounded-[30px] border border-[#e7dfd7] bg-[#fffdfb] p-8 shadow-[0_25px_60px_rgba(34,23,17,0.08)]">
        <Link href="/" className="text-xs uppercase tracking-[0.3em] text-[#8c7767]">Journal</Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.07em]">{mode === 'sign-up' ? 'Create your archive' : 'Welcome back'}</h1>
        <p className="mt-3 text-sm leading-6 text-[#685d56]">A private place for the moments you want to keep close.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {mode === 'sign-up' && <label className="block text-sm font-medium">Name<input required name="name" className="mt-2 w-full rounded-2xl border border-[#e4d8cf] bg-[#fbf8f5] px-4 py-3 outline-none focus:border-[#8c7767]" /></label>}
          <label className="block text-sm font-medium">Email<input required type="email" name="email" className="mt-2 w-full rounded-2xl border border-[#e4d8cf] bg-[#fbf8f5] px-4 py-3 outline-none focus:border-[#8c7767]" /></label>
          <label className="block text-sm font-medium">Password<input required minLength={6} type="password" name="password" className="mt-2 w-full rounded-2xl border border-[#e4d8cf] bg-[#fbf8f5] px-4 py-3 outline-none focus:border-[#8c7767]" /></label>
          {error && <p className="rounded-2xl bg-[#f9e4df] p-3 text-sm text-[#8c3f35]">{error}</p>}
          {message && <p className="rounded-2xl bg-[#f2eae2] p-3 text-sm text-[#4e433d]">{message}</p>}
          <button disabled={loading} className="w-full rounded-full bg-[#1a1715] px-5 py-3 text-sm font-medium text-[#f5efe9] disabled:opacity-60">{loading ? 'Please wait...' : mode === 'sign-up' ? 'Sign up' : 'Sign in'}</button>
        </form>

        <button type="button" onClick={() => setMode(mode === 'sign-up' ? 'sign-in' : 'sign-up')} className="mt-6 text-sm text-[#725f52] underline underline-offset-4">
          {mode === 'sign-up' ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </button>
      </section>
    </main>
  );
}
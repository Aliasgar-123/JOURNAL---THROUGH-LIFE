import { SiteShell } from '@/components/site-shell';

export default function AcademiaPage() {
  return (
    <SiteShell title="Academia" subtitle="Education and achievements">
      <div className="grid gap-6 md:grid-cols-3">
        {[
          ['University', '2025–2026', 'Computer Science'],
          ['Projects', '2026', 'Capstone thesis'],
          ['Achievements', '2025', 'Dean’s list'],
        ].map(([label, year, detail]) => (
          <article key={label} className="rounded-[28px] border border-[#e7dfd7] bg-[#fffdfb] p-6 shadow-sm">
            <div className="text-xs uppercase tracking-[0.22em] text-[#8c7a6d]">{label}</div>
            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-[#1d1a18]">{year}</h3>
            <p className="mt-3 text-sm leading-7 text-[#504a46]">{detail}</p>
          </article>
        ))}
      </div>
    </SiteShell>
  );
}

import { PreserveMemoryButton } from './preserve-memory-button';
import { JournalSidebar } from './journal-sidebar';
import type { MemoryCategory } from '@/lib/types';

export function SiteShell({
  title,
  subtitle,
  memoryCategory,
  tripId,
  hideCreateMemoryButton = false,
  children,
}: {
  title: string;
  subtitle: string;
  memoryCategory?: MemoryCategory;
  tripId?: string;
  hideCreateMemoryButton?: boolean;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f5f0ea] text-[#1d1d1b]">
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8 lg:px-8">
        <JournalSidebar
          activeHref={
            title === 'Life timeline' ? '/timeline'
              : title === 'Memories' ? '/memories'
                : title === 'Favorites' ? '/favorites'
                  : title === 'Travel' || tripId ? '/travel'
                    : title === 'Academia' ? '/academia'
                      : title === 'Dashboard' ? '/'
                        : memoryCategory === 'Travel' ? '/travel' : '/memories'
          }
        />

        <div className="flex-1 space-y-8">
          <header className="rounded-[30px] border border-[#e7dfd7] bg-[#f9f4f1] p-6 shadow-[0_25px_60px_rgba(34,23,17,0.04)]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[#8c7767]">{subtitle}</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-[-0.07em] text-[#1a1715]">{title}</h2>
              </div>

              {!hideCreateMemoryButton && <PreserveMemoryButton category={memoryCategory} tripId={tripId} />}
            </div>
          </header>

          {children}
        </div>
      </div>
    </main>
  );
}

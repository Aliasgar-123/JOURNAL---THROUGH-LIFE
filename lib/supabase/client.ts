import { createBrowserClient } from '@supabase/ssr';

export type Database = {
  public: {
    Tables: {
      memories: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          memory_date: string;
          category: string;
          location: string;
          description: string;
          mood: string;
          favorite: boolean;
          locked: boolean;
        };
        Insert: {
          user_id: string;
          title: string;
          description: string;
          memory_date?: string;
          category?: string;
          location?: string;
          mood?: string;
          favorite?: boolean;
          locked?: boolean;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}

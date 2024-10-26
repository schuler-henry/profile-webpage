import {
  CookieMethodsServer,
  CookieOptionsWithName,
  createServerClient,
  type CookieOptions,
} from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  GenericSchema,
  SupabaseClientOptions,
} from '@supabase/supabase-js/dist/module/lib/types';
import { cookies } from 'next/headers';

export async function createClient<
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
  Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
    ? Database[SchemaName]
    : any,
>(
  options?: SupabaseClientOptions<SchemaName> & {
    cookieOptions?: CookieOptionsWithName;
    cookieEncoding?: 'raw' | 'base64url';
  },
): Promise<SupabaseClient<Database, SchemaName, Schema>> {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      ...options,
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

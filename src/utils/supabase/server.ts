import { CookieOptionsWithName, createServerClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  GenericSchema,
  SupabaseClientOptions,
} from '@supabase/supabase-js/dist/module/lib/types';
import { cookies } from 'next/headers';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

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
  let cookieStore: ReadonlyRequestCookies | null = null;

  // Normally this client should only be created in server components and therefore be called as result of a request.
  // However, if this is not the case, cookies() will throw an error.
  // In that case, we will simply ignore the cookie store and create the client without it.
  try {
    cookieStore = await cookies();
  } catch (error) {
    cookieStore = null;
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      ...options,
      cookies: {
        getAll() {
          return cookieStore?.getAll() || [];
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore?.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

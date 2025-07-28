import { CookieOptionsWithName, createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  GenericSchema,
  SupabaseClientOptions,
} from '@supabase/supabase-js/dist/module/lib/types';

export function createClient<
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
): SupabaseClient<Database, SchemaName, Schema> {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { ...options, auth: { persistSession: false } },
  );
}

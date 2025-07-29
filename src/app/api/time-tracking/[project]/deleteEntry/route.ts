import { DatabaseAdapter } from '@/src/backend/data-access/database/databaseAdapter';
import { SupabaseAdapter } from '@/src/backend/data-access/database/supabaseAdapter';

export async function POST(req: Request) {
  const db: DatabaseAdapter = new SupabaseAdapter();

  const { id }: { id: string } = await req.json();

  const resp = await db.deleteTimeTrackingEntry(id);
  if (resp.error) {
    console.log(resp.error);
    return new Response(null, {
      status: 400,
    });
  }
  return new Response(null, {
    status: 200,
  });
}

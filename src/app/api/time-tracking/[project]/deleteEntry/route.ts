import { DatabaseAdapter } from '@/src/app/api/databaseAdapter';
import { SupabaseAdapter } from '@/src/app/api/supabaseAdapter';

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

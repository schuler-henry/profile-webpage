import { User } from '@supabase/supabase-js';

export const mockUser: User = {
  id: 'c2f0449a-a510-47be-885d-58c18662cdea',
  aud: 'authenticated',
  app_metadata: { provider: 'github', providers: ['github'] },
  user_metadata: {},
  created_at: '2024-10-22 19:59:14.834447+00',
};

export const otherMockUser: User = {
  id: '5ebd4db3-abc0-4f32-8459-325eecdead3e',
  aud: 'authenticated',
  app_metadata: { provider: 'github', providers: ['github'] },
  user_metadata: {},
  created_at: '2025-02-01 03:29:16.533571+00',
};

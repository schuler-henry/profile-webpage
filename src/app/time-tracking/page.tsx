import ProjectCard from '@/src/components/modules/time-tracking/ProjectCard/ProjectCard';
import { createClient } from '@/src/utils/supabase/server';
import { PostgrestResponse } from '@supabase/supabase-js';
import React from 'react';
import { TimeTrackingProject } from '../api/supabaseTypes';
import AddProjectButton from '@/src/components/modules/time-tracking/AddProjectButton/AddProjectButton';
import { Stack } from '@mui/material';
import moment from 'moment';

export default async function TimeTracking() {
  const client = await createClient({
    auth: { persistSession: false },
    db: { schema: 'time-tracking' },
  });

  const { data: userData, error: userError } = await client.auth.getUser();

  if (userError || !userData.user) {
    return <div>Not authenticated</div>;
  }

  const {
    data: projectData,
    error: projectError,
  }: PostgrestResponse<TimeTrackingProject> = await client
    .from('Project')
    .select('*')
    .eq('owner', userData.user.id);

  return (
    <Stack direction="column" spacing={2}>
      <AddProjectButton />
      {projectData
        ?.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)))
        .map((project: TimeTrackingProject) => {
          return (
            <ProjectCard key={'ProjectCard' + project.id} project={project} />
          );
        })}
    </Stack>
  );
}

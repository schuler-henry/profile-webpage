import {
  TimeTrackingProject,
  TimeTrackingTimeEntry,
} from '@/app/api/supabaseTypes';
import { createClient } from '@/utils/supabase/server';
import { Typography } from '@mui/material';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import React from 'react';
import TimeTrackingContent from './TimeTrackingContent';
import moment from 'moment';

export default async function TimeTrackingProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ project: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const projectId = (await params).project;
  const create: boolean = (await searchParams).create === 'true';

  const db = await createClient({
    db: { schema: 'time-tracking' },
  });

  const { data: userData, error: userError } = await db.auth.getUser();
  if (userError || !userData.user) {
    return <div>Not authenticated</div>;
  }

  if (create) {
    const project: TimeTrackingProject = {
      id: projectId,
      name: '',
      description: '',
      owner: userData.user.id,
      createdAt: moment().toISOString(),
    };

    const { error } = await db.from('Project').insert([project]);

    if (error) {
      return redirect('/time-tracking');
    } else {
      // Redirect in order to avoid re-creating the project on page refresh
      return redirect('/time-tracking/' + projectId);
    }
  }

  const {
    data: projectResult,
    error: projectError,
  }: PostgrestSingleResponse<TimeTrackingProject[]> = await db
    .from('Project')
    .select('*')
    .eq('id', projectId)
    .eq('owner', userData.user.id);

  if (projectError || projectResult.length == 0) {
    return <div>Error loading project</div>;
  }

  const project = projectResult[0];

  const {
    data: timeEntriesResult,
    error: timeEntriesError,
  }: PostgrestSingleResponse<TimeTrackingTimeEntry[]> = await db
    .from('TimeEntry')
    .select('*')
    .order('date', { ascending: false })
    .order('startTime', { ascending: false })
    .eq('project', project.id);

  if (timeEntriesError || !timeEntriesResult) {
    return <div>Error loading time entries</div>;
  }

  const timeEntries = timeEntriesResult;

  return (
    <div>
      <Typography variant="h5">{project.name}</Typography>
      <Typography variant="subtitle2" fontStyle="italic">
        "{project.description}"
      </Typography>
      <TimeTrackingContent project={project} timeEntries={timeEntries} />
    </div>
  );
}

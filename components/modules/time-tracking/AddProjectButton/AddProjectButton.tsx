'use client';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { v4 as uuid4 } from 'uuid';
import React from 'react';

export default function AddProjectButton() {
  const router = useRouter();

  const handleAddProject = () => {
    const newProjectId = uuid4();
    router.push('/time-tracking/' + newProjectId + '?create=true');
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<FontAwesomeIcon height={20} width={20} icon={faAdd} />}
      onClick={handleAddProject}
    >
      New Time-Tracking Project
    </Button>
  );
}

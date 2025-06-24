import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectDetails from './components/ProjectDetails';
import ProjectTeam from './components/ProjectTeam';
import KanbanBoard from './components/KanbanBoard';
import { fetchProjects } from '../../utility/projectService';
import { Box, Typography, Button } from '@mui/material';

// Try to fetch a single project by ID, fallback to fetch all if not available
async function fetchProjectById(projectId) {
  // Try direct endpoint if available
  try {
    const res = await fetch(`/api/projects/${projectId}`);
    if (res.ok) return await res.json();
  } catch {}
  // Fallback: fetch all and find
  const result = await fetchProjects();
  if (result?.data) {
    return result.data.find(p => String(p.id) === String(projectId)) || null;
  }
  return null;
}

export default function ProjectViewPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProjectById(projectId)
      .then(setProject)
      .catch(e => setError(e?.message || 'Failed to load project'))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <Typography>Loading project...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!project) return <Typography>Project not found.</Typography>;

  return (
    <Box p={3}>
      <ProjectDetails project={project} />
      <ProjectTeam projectId={project.id} />
      <KanbanBoard projectId={project.id} />
    </Box>
  );
}

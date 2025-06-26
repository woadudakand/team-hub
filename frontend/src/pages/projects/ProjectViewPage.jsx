import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectDetails from './components/ProjectDetails';
import ProjectTeam from './components/ProjectTeam';
import KanbanBoard from './components/KanbanBoard';
import { fetchProjects } from '../../utility/projectService';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';

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

  const breadcrumbs = project ? [
    { label: 'Projects', path: '/projects' },
    { label: project.name, path: `/projects/${project.id}` }
  ] : [
    { label: 'Projects', path: '/projects' },
    { label: 'Loading...', path: '#' }
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <AppBreadcrumbs customBreadcrumbs={breadcrumbs} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <AppBreadcrumbs customBreadcrumbs={breadcrumbs} />
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  if (!project) {
    return (
      <Box sx={{ p: 3 }}>
        <AppBreadcrumbs customBreadcrumbs={breadcrumbs} />
        <Alert severity="warning">Project not found.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <AppBreadcrumbs customBreadcrumbs={breadcrumbs} />
      <ProjectDetails project={project} />
      <ProjectTeam projectId={project.id} />
      <KanbanBoard projectId={project.id} />
    </Box>
  );
}

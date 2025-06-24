import React from 'react';
import { Box, Typography } from '@mui/material';

export default function ProjectDetails({ project }) {
  if (!project) return null;
  return (
    <Box mb={3}>
      <Typography variant="h5">{project.name}</Typography>
      <Typography color="text.secondary">{project.description}</Typography>
      <Typography variant="body2" mt={1}>Status: {project.status}</Typography>
    </Box>
  );
}

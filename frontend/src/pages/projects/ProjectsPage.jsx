import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ProjectTable from './ProjectTable';
import ProjectForm from './ProjectForm';

export default function ProjectsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };
  const handleEdit = (project) => {
    setEditData(project);
    setModalOpen(true);
  };
  const handleFormClose = (refresh) => {
    setModalOpen(false);
    setEditData(null);
    if (refresh && window.location) window.location.reload(); // simple reload for now
  };
  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Projects</Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>New Project</Button>
      </Box>
      <ProjectTable onEdit={handleEdit} />
      <ProjectForm open={modalOpen} onClose={handleFormClose} editData={editData} />
    </Box>
  );
}

import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Divider, Toolbar } from '@mui/material';
import ProjectTable from './ProjectTable';
import ProjectForm from './ProjectForm';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';
import AddIcon from '@mui/icons-material/Add';

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
  
  const handleFormClose = () => {
    setModalOpen(false);
    setEditData(null);
    // Remove the reload, let the table handle refresh internally
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <AppBreadcrumbs />
      <Card elevation={2}>
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ flex: 1, fontWeight: 600 }}>
            Projects
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAdd}
            startIcon={<AddIcon />}
            sx={{ ml: 2 }}
          >
            New Project
          </Button>
        </Toolbar>
        <Divider />
        <CardContent sx={{ p: 0 }}>
          <ProjectTable onEdit={handleEdit} />
        </CardContent>
      </Card>
      <ProjectForm open={modalOpen} onClose={handleFormClose} editData={editData} />
    </Box>
  );
}

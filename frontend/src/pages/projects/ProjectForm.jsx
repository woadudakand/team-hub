import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, CircularProgress } from '@mui/material';
import { createProject, updateProject } from '../../utility/projectService';
import { fetchProjectStatuses } from '../../utility/projectStatusService';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../hooks/useNotification';

export default function ProjectForm({ open, onClose, editData }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { success, error } = useNotification();

  useEffect(() => {
    if (editData) {
      setName(editData.name || '');
      setDescription(editData.description || '');
      setStatus(editData.status || 'active');
    } else {
      setName('');
      setDescription('');
      setStatus('active');
    }
  }, [editData]);

  useEffect(() => {
    fetchProjectStatuses({ page: 1, limit: 100 }).then(res => {
      setStatusOptions(res.rows ? res.rows.filter(s => !s.deleted) : []);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      if (editData) {
        await updateProject(editData.id, { name, description, status });
        success('Project updated successfully');
        onClose(true);
      } else {
        const created = await createProject({ name, description, status });
        success('Project created successfully');
        onClose(false); // close modal
        if (created && created.id) {
          navigate(`/projects/${created.id}`); // go to new project page
        }
      }
    } catch {
      error('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{editData ? 'Edit Project' : 'New Project'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            required
            margin="normal"
            autoFocus
            error={!name.trim() && name.length > 0}
            helperText={!name.trim() && name.length > 0 ? 'Project name is required' : ''}
            inputProps={{
              'aria-label': 'Project name',
              maxLength: 100
            }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={3}
            inputProps={{
              'aria-label': 'Project description',
              maxLength: 500
            }}
            helperText={`${description.length}/500 characters`}
          />
          <TextField
            select
            label="Status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            fullWidth
            margin="normal"
            required
            inputProps={{ 'aria-label': 'Project status' }}
          >
            {statusOptions.map(opt => (
              <MenuItem key={opt.status} value={opt.status}>
                {opt.status.charAt(0).toUpperCase() + opt.status.slice(1).replace(/_/g, ' ')}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !name.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { createAnnouncement, updateAnnouncement } from '../../utility/dataService';

const AnnouncementForm = ({ open, onClose, editData }) => {
  const [form, setForm] = useState(editData || {
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    files: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (editData) {
      await updateAnnouncement(editData.id, form);
    } else {
      await createAnnouncement(form);
    }
    setLoading(false);
    onClose(true);
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{editData ? 'Edit Announcement' : 'Add Announcement'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
        <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth required />
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth required multiline rows={3} />
        <TextField label="Start Date" name="start_date" type="date" value={form.start_date} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
        <TextField label="End Date" name="end_date" type="date" value={form.end_date} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
        <TextField label="Files (URL or name)" name="files" value={form.files} onChange={handleChange} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>{editData ? 'Update' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnnouncementForm;

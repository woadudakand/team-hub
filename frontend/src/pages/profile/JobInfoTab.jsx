import React, { useState, useEffect } from 'react';
import { DataService as axios } from '../../utility/dataService';
import { Box, TextField, Button, MenuItem, Select } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';

export default function JobInfoTab() {
  const { userId } = useParams();
  const loggedInUser = useSelector((state) => state.auth.user);
  const actualUserId = userId || loggedInUser?.id;
  const isOwn = actualUserId === loggedInUser?.id;
  const isSuperadmin = loggedInUser?.role === 'superadmin';
  const canEdit = isOwn || isSuperadmin;

  const [form, setForm] = useState(null);
  const [teams, setTeams] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [jobRes, teamRes] = await Promise.all([
        axios.get(`/job-info/${actualUserId}`),
        axios.get('/team'),
      ]);
      // Format date_of_hire for input type="date"
      let date_of_hire = jobRes.data?.date_of_hire || '';
      if (date_of_hire && date_of_hire.length > 10) {
        date_of_hire = date_of_hire.slice(0, 10);
      }
      setForm({ ...jobRes.data, date_of_hire, user_id: actualUserId });
      setTeams(teamRes.data);
      setLoading(false);
    }
    if(actualUserId){
      fetchData();
    }
  }, [actualUserId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.put(`/job-info/${form.user_id}`, form);
      setEditing(false);
      setForm({ ...form, ...data });
    } catch (err) {
      alert('Failed to update job info');
    }
  };

  if (loading || !form) return <Loader message="Loading job info..." />;

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField label="Job Title" name="job_title" value={form.job_title || ''} onChange={handleChange} disabled={!canEdit || !editing} />
      <Select name="team_id" value={form.team_id || ''} onChange={handleChange} disabled={!canEdit || !editing} displayEmpty>
        <MenuItem value="">Select Team</MenuItem>
        {(Array.isArray(teams) ? teams : []).map((team) => (
          <MenuItem key={team.id} value={team.id}>{team.title}</MenuItem>
        ))}
      </Select>
      <TextField label="Salary" name="salary" value={form.salary || ''} onChange={handleChange} disabled={!canEdit || !editing} />
      <TextField
        label="Date of Hire"
        name="date_of_hire"
        type="date"
        value={form.date_of_hire || ''}
        onChange={handleChange}
        disabled={!canEdit || !editing}
        InputLabelProps={{ shrink: true }}
      />
      {canEdit && !editing && <Button onClick={() => setEditing(true)}>Edit</Button>}
      {canEdit && editing && <Button variant="contained" onClick={handleSave}>Save</Button>}
    </Box>
  );
}

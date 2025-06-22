import React, { useState, useEffect } from 'react';
import { DataService as axios } from '../utility/dataService';
import { Box, TextField, Button, Select, MenuItem } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';

export default function AccountInfoTab() {
  const { userId } = useParams();
  const loggedInUser = useSelector((state) => state.auth.user);
  const actualUserId = userId || loggedInUser?.id;
  const isOwn = actualUserId === loggedInUser?.id;
  const isSuperadmin = loggedInUser?.role === 'superadmin';
  const canEdit = isOwn || isSuperadmin;

  const [form, setForm] = useState(null);
  const [roles, setRoles] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [userRes, roleRes] = await Promise.all([
        axios.get(`/users/${actualUserId}`),
        axios.get('/user-role'),
      ]);
      setForm({ ...userRes.data, password: '' }); // Always set password to empty string
      setRoles(roleRes.data);
      setLoading(false);
    }
    if(actualUserId) {
      fetchData();
    }
  }, [actualUserId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const payload = {
        username: form.username,
        email: form.email,
        role: form.role,
      };
      // Only send password if not empty string
      if (form.password && form.password.trim() !== '') payload.password = form.password;
      const { data } = await axios.put(`/account-info/${form.id}`, payload);
      setEditing(false);
      setForm({ ...form, ...data, password: '' }); // Reset password field after save
    } catch (err) {
      alert('Failed to update account info');
    }
  };

  if (!canEdit) return null;
  if (loading || !form) return <Loader message="Loading account info..." />;

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField label="Username" name="username" value={form.username || ''} onChange={handleChange} disabled={!canEdit || !editing} />
      <TextField label="Email" name="email" value={form.email || ''} onChange={handleChange} disabled={!canEdit || !editing} />
      <TextField label="Password" name="password" type="password" value={form.password || ''} onChange={handleChange} disabled={!canEdit || !editing} />
      <Select name="role" value={form.role || ''} onChange={handleChange} disabled={!canEdit || !editing} displayEmpty>
        <MenuItem value="">Select Role</MenuItem>
        {(Array.isArray(roles) ? roles : []).map((role) => (
          <MenuItem key={role.id} value={role.role}>{role.role}</MenuItem>
        ))}
      </Select>
      {canEdit && !editing && <Button onClick={() => setEditing(true)}>Edit</Button>}
      {canEdit && editing && <Button variant="contained" onClick={handleSave}>Save</Button>}
    </Box>
  );
}

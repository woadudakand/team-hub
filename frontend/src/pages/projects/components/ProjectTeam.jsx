import React, { useEffect, useState } from 'react';
import { fetchProjectUsers, addProjectUser, removeProjectUser } from '../../../utility/projectUserService';
import { Box, Typography, Button, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProjectTeam({ projectId }) {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');

  const fetchData = async () => {
    const data = await fetchProjectUsers(projectId);
    setUsers(data);
  };
  useEffect(() => { if (projectId) fetchData(); }, [projectId]);

  const handleAdd = async () => {
    if (!email) return;
    await addProjectUser(projectId, { user_id: email, role }); // expects user_id, but you may want to search by email in real app
    setEmail('');
    setRole('member');
    fetchData();
  };
  const handleRemove = async (userId) => {
    await removeProjectUser(projectId, userId);
    fetchData();
  };

  return (
    <Box mb={3}>
      <Typography variant="h6">Team</Typography>
      <Box display="flex" gap={1} my={2}>
        <TextField size="small" label="User ID or Email" value={email} onChange={e => setEmail(e.target.value)} />
        <TextField size="small" label="Role" value={role} onChange={e => setRole(e.target.value)} />
        <Button variant="contained" onClick={handleAdd}>Add</Button>
      </Box>
      <ul style={{ paddingLeft: 0 }}>
        {users.map(u => (
          <li key={u.user_id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{u.name || u.user_id} ({u.role})</span>
            <IconButton size="small" color="error" onClick={() => handleRemove(u.user_id)}><DeleteIcon /></IconButton>
          </li>
        ))}
        {users.length === 0 && <li><Typography color="text.secondary">No team members yet.</Typography></li>}
      </ul>
    </Box>
  );
}

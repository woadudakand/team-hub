import React from 'react';
import { Avatar, Menu, MenuItem, Typography, Divider, Box, IconButton, ListItemIcon } from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import Person from '@mui/icons-material/Person';

export default function UserMenu({ user, onSignOut, onProfile, onSettings }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={handleMenu} size="small">
        <Avatar src={user?.avatarUrl}>{user?.username?.[0]}</Avatar>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}>
        <Box px={2} py={1} display="flex" flexDirection="column" alignItems="center">
          <Avatar src={user?.avatarUrl} sx={{ width: 56, height: 56, mb: 1 }}>{user?.username?.[0]}</Avatar>
          <Typography variant="subtitle1">{user?.username}</Typography>
          <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={onProfile}>
          <ListItemIcon><Person fontSize="small" /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={onSettings}>
          <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={onSignOut}>
          <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
}

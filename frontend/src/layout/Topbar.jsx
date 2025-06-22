import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';

export default function Topbar({ onMenuToggle, user }) {
  return (
    <AppBar position="fixed" color="inherit" elevation={1} sx={{ zIndex: 1201 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onMenuToggle} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" color="primary" fontWeight={700} sx={{ mr: 2 }}>
          TEAM HUB
        </Typography>
        <Box flexGrow={1} />
        <IconButton color="inherit">
          <Badge badgeContent={2} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit">
          <MailIcon />
        </IconButton>
        <Box ml={2} display="flex" alignItems="center">
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', mr: 1 }}>
            {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '_'}
          </Avatar>
          <Typography variant="body2" color="textSecondary">
            {user?.username?.toUpperCase() || 'ADMIN _'}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

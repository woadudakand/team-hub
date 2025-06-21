import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Switch, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Topbar({ onMenuToggle, open, darkMode, onThemeToggle }) {
  return (
    <AppBar style={{marginLeft: open ? 240 : 0, width: open ? 'calc(100% - 240px)' : 'calc(100% - 0px)'}} position="static" color={darkMode ? 'default' : 'white'}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onMenuToggle} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>

        </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body2" sx={{ mr: 1 }}>Dark Mode</Typography>
          <Switch checked={darkMode} onChange={onThemeToggle} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

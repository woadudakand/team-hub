import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Badge, Box, ListItemButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EventIcon from '@mui/icons-material/Event';
import FolderIcon from '@mui/icons-material/Folder';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const menu = [
  { label: 'dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'profile', icon: <AdminPanelSettingsIcon />, path: '/profile' },
  { label: 'handbook', icon: <BookIcon /> },
  { label: 'announcements', icon: <NotificationsIcon /> },
  { label: 'events', icon: <EventIcon /> },
  { label: 'projects', icon: <FolderIcon /> },
  { label: 'settings', icon: <AdminPanelSettingsIcon />, path: '/settings' },
];

export default function SideMenu({ open }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (!path) return false;
    // Exact match for main menu

    if (location.pathname === path) return true;
    // For dashboard and profile, also highlight for nested routes
    if ((path === '/dashboard' || path === '/profile') && location.pathname.startsWith(path)) return true;
    // For other menu items, only highlight on exact match
    return false;
  };

  return (
    <Drawer variant="permanent" open={open} sx={{ width: 240, flexShrink: 0, '& .MuiDrawer-paper': { width: open ? 240 : 0, boxSizing: 'border-box' } }}>
      <Box display="flex" alignItems="center" justifyContent="center" py={2}>
        {/* <img src="/logo192.png" alt="Logo" style={{ height: 40, marginRight: 8 }} /> */}
        <span style={{ fontWeight: 700, fontSize: 22, color: '#1976d2' }}>TEAM HUB</span>
      </Box>
      <Divider />
      <List>
        {menu.map((item) => (
          <ListItem disablePadding key={item.label}>
            <ListItemButton
              onClick={() => item.path && navigate(item.path)}
              selected={isActive(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={t(item.label)} />
              {item.badge && <Badge color="error" badgeContent={item.badge} sx={{ ml: 1 }} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

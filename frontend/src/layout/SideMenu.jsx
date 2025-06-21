import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Collapse, Badge, Divider, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EventIcon from '@mui/icons-material/Event';
import FolderIcon from '@mui/icons-material/Folder';
import GroupIcon from '@mui/icons-material/Group';
import PowerOffIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

const menu = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Handbook', icon: <BookIcon /> },
  { label: 'Announcements', icon: <NotificationsIcon /> },
  {
    label: 'HR & Admin', icon: <AdminPanelSettingsIcon />, children: [
      { label: 'Subitem 1' }, { label: 'Subitem 2' }
    ]
  },
  { label: 'Evaluation', icon: <AssessmentIcon /> },
  { label: 'Events', icon: <EventIcon /> },
  { label: 'Projects', icon: <FolderIcon /> },
  {
    label: 'Team', icon: <GroupIcon />, children: [
      { label: 'Subitem 1' }, { label: 'Subitem 2' }
    ]
  }
];

export default function SideMenu({ open, onClose, onSignout }) {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = React.useState({});

  const handleMenuClick = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <Drawer variant="permanent" open={open} sx={{ width: 240, flexShrink: 0, '& .MuiDrawer-paper': { width: open ? 240 : 0, boxSizing: 'border-box' } }}>
      <Box display="flex" alignItems="center" justifyContent="center" py={2}>
        {/* <img src="/logo192.png" alt="Logo" style={{ height: 40, marginRight: 8 }} /> */}
        <span style={{ fontWeight: 700, fontSize: 22, color: '#1976d2' }}>TEAM HUB</span>
      </Box>
      <Divider />
      <List>
        {menu.map((item, idx) => (
          <React.Fragment key={item.label}>
            <ListItem button onClick={() => {
              if (item.children) handleMenuClick(item.label);
              else if (item.path) navigate(item.path);
            }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
              {item.badge && <Badge color="error" badgeContent={item.badge} sx={{ ml: 1 }} />}
              {item.children && (openMenus[item.label] ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
            {item.children && (
              <Collapse in={openMenus[item.label]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((sub, i) => (
                    <ListItem button key={sub.label} sx={{ pl: 4 }}>
                      <ListItemText primary={sub.label} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}

        <ListItem button onClick={onSignout}>
            <ListItemIcon><PowerOffIcon /></ListItemIcon>
            <ListItemText primary="Signout" />
        </ListItem>
      </List>
    </Drawer>
  );
}

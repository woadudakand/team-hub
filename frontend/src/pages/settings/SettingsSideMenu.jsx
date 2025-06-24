import React from 'react';
import { List, ListItemButton, ListItemText, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const settingsMenu = [
  { label: 'themeSettings', path: '/settings/theme-settings' },
  { label: 'team', path: '/settings/team' },
  { label: 'userRole', path: '/settings/user-role' }
];

export default function SettingsSideMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <Box width={220} minHeight="100vh" borderRight="1px solid #eee">
      <Box py={2} textAlign="center" fontWeight={700} fontSize={20} color="#1976d2">
        {t('settings', 'Settings')}
      </Box>
      <List>
        {settingsMenu.map((item) => {
          const selected = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.label}
              onClick={() => navigate(item.path)}
              selected={selected}
              aria-current={selected ? 'page' : undefined}
            >
              <ListItemText primary={t(item.label, item.label)} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

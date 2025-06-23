import React from 'react';
import { Outlet } from 'react-router-dom';
import SettingsSideMenu from './SettingsSideMenu';
import { Box } from '@mui/material';

export default function SettingsPage() {
  return (
    <Box display="flex">
      <SettingsSideMenu />
      <Box flex={1} p={3}>
        <Outlet />
      </Box>
    </Box>
  );
}

import React from 'react';
import Topbar from './Topbar';
import SideMenu from './SideMenu';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function DashboardLayout({ children, onSignout, user }) {
  const [darkMode, setDarkMode] = React.useState(false);
  const [sideOpen, setSideOpen] = React.useState(true);
  const [menuPosition, setMenuPosition] = React.useState('side'); // 'side' or 'top'

  const theme = React.useMemo(() => createTheme({
    palette: { mode: darkMode ? 'dark' : 'light' },
  }), [darkMode]);

  const { t } = useTranslation();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Topbar
          onMenuToggle={() => setSideOpen((o) => !o)}
          darkMode={darkMode}
          open={sideOpen}
          onThemeToggle={() => setDarkMode((d) => !d)}
          user={user}
        />
      {menuPosition === 'side' && (
        <SideMenu onMenuToggle={() => setSideOpen((o) => !o)} open={sideOpen} onClose={() => setSideOpen(false)} onSignout={onSignout} />
      )}
      <Box sx={{ ml: menuPosition === 'side' && sideOpen ? 30 : 0, mt: menuPosition === 'top' ? 8 : 0, p: 3 }}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <button onClick={() => setMenuPosition(menuPosition === 'side' ? 'top' : 'side')}>
            {t('switchTo')} {menuPosition === 'side' ? t('topbar') : t('sidemenu')}
          </button>
        </Box>
        {children}
      </Box>
    </ThemeProvider>
  );
}

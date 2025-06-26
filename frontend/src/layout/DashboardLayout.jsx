import React from 'react';
import Topbar from './Topbar';
import SideMenu from './SideMenu';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ThemeModeDirectionSync from '../features/theme/ThemeModeDirectionSync';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import KeyboardShortcutsHelp from '../components/common/KeyboardShortcutsHelp';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';

export default function DashboardLayout({ onSignout }) {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = React.useState(false);
  const [direction, setDirection] = React.useState('ltr');
  const [sideOpen, setSideOpen] = React.useState(true);
  const [menuPosition, setMenuPosition] = React.useState('side'); // 'side' or 'top'

  // Global keyboard shortcuts
  useKeyboardShortcuts({
    'g+d': () => navigate('/dashboard'),
    'g+p': () => navigate('/projects'),
    'g+s': () => navigate('/settings'),
    'g+a': () => navigate('/announcements'),
  });

  const theme = React.useMemo(() => createTheme({
    direction,
    palette: { mode: darkMode ? 'dark' : 'light' },
  }), [darkMode, direction]);

  const { t } = useTranslation();

  React.useEffect(() => {
    document.body.dir = direction;
  }, [direction]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeModeDirectionSync setDarkMode={setDarkMode} setDirection={setDirection} />
      <Topbar
          onMenuToggle={() => setSideOpen((o) => !o)}
          darkMode={darkMode}
          open={sideOpen}
          onThemeToggle={() => setDarkMode && setDarkMode((d) => !d)}
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
        {/* Render nested route content here */}
        <Outlet />
      </Box>
      <KeyboardShortcutsHelp />
    </ThemeProvider>
  );
}

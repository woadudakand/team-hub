import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function Topbar({ onMenuToggle, user }) {
  const { i18n } = useTranslation();
  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'bn', label: 'BN' },
    { code: 'es', label: 'ES' },
    { code: 'fr', label: 'FR' },
    { code: 'de', label: 'DE' },
    { code: 'hi', label: 'HI' },
    { code: 'ar', label: 'AR' },
    { code: 'ru', label: 'RU' },
    { code: 'zh', label: 'ZH' },
    { code: 'pt', label: 'PT' },
  ];
  const theme = useSelector(state => state.theme);
  const logoUrl = theme.logo ? (theme.logo.startsWith('http') ? theme.logo : (import.meta.env.VITE_API_URL + theme.logo)) : null;
  const faviconUrl = theme.favicon ? (theme.favicon.startsWith('http') ? theme.favicon : (import.meta.env.VITE_API_URL + theme.favicon)) : null;
  const title = theme.title || 'TEAM HUB';

  useEffect(() => {
    // Update browser tab title
    document.title = title;
    // Update favicon
    if (faviconUrl) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [title, faviconUrl]);

  return (
    <AppBar position="fixed" color="inherit" elevation={1} sx={{ zIndex: 1201 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onMenuToggle} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        {logoUrl ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <img src={logoUrl} alt="logo" style={{ height: 36, maxWidth: 120, objectFit: 'contain' }} />
          </Box>
        ) : (
          <Typography variant="h6" color="primary" fontWeight={700} sx={{ mr: 2 }}>
            {title}
          </Typography>
        )}
        <Box flexGrow={1} />
        <IconButton color="inherit">
          <Badge badgeContent={2} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit">
          <MailIcon />
        </IconButton>
        {/* Language Switcher */}
        <Box ml={2} display="flex" alignItems="center">
          <select
            value={i18n.language}
            onChange={e => i18n.changeLanguage(e.target.value)}
            style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', marginRight: 16 }}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </Box>
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

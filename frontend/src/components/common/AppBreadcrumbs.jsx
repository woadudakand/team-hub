import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const breadcrumbNameMap = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/settings': 'Settings',
  '/settings/team': 'Team Settings',
  '/settings/user-roles': 'User Roles',
  '/settings/project-status': 'Project Status',
  '/announcements': 'Announcements',
  '/profile': 'Profile'
};

export default function AppBreadcrumbs({ customBreadcrumbs = [] }) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // If custom breadcrumbs are provided, use them instead
  if (customBreadcrumbs.length > 0) {
    return (
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link
            component={RouterLink}
            to="/dashboard"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Dashboard
          </Link>
          {customBreadcrumbs.map((crumb, index) => (
            index === customBreadcrumbs.length - 1 ? (
              <Typography key={crumb.label} color="text.primary" sx={{ fontWeight: 500 }}>
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={crumb.label}
                component={RouterLink}
                to={crumb.path}
                sx={{
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {crumb.label}
              </Link>
            )
          ))}
        </Breadcrumbs>
      </Box>
    );
  }

  // Auto-generate breadcrumbs from URL
  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link
          component={RouterLink}
          to="/dashboard"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = breadcrumbNameMap[to] || value.charAt(0).toUpperCase() + value.slice(1);

          return last ? (
            <Typography key={to} color="text.primary" sx={{ fontWeight: 500 }}>
              {label}
            </Typography>
          ) : (
            <Link
              key={to}
              component={RouterLink}
              to={to}
              sx={{
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}

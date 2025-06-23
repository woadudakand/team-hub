import React from 'react';
import { useSelector } from 'react-redux';
import { Tabs, Tab, Box } from '@mui/material';
import { Outlet, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { t } = useTranslation();
  const loggedInUser = useSelector((state) => state.auth.user);
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.userId || loggedInUser?.id;
  const isOwn = userId === loggedInUser?.id;
  const isSuperadmin = loggedInUser?.role === 'superadmin';
  const canEdit = isOwn || isSuperadmin;

  // Determine tab index from path
  const tabPaths = ['general-info', 'job-info', 'account-info'];
  let currentTab = tabPaths.findIndex((p) => location.pathname.includes(p));
  if (currentTab === -1) currentTab = 0;

  const handleTabChange = (_, newValue) => {
    const base = `/profile${params.userId ? `/${params.userId}` : ''}`;
    navigate(`${base}/${tabPaths[newValue]}`);
  };

  return (
    <Box maxWidth={700} mx="auto" mt={4}>
      <Tabs value={currentTab} onChange={handleTabChange}>
        <Tab label={t('generalInfo')} component={Link} to={`general-info`} />
        <Tab label={t('jobInfo')} component={Link} to={`job-info`} />
        {canEdit && <Tab label={t('accountInfo')} component={Link} to={`account-info`} />}
      </Tabs>
      <Box mt={3}>
        <Outlet />
      </Box>
    </Box>
  );
}

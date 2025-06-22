import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const handleSignout = async () => {
    await dispatch(signout());
    navigate('/signin');
  };

  return (
    <DashboardLayout onSignout={handleSignout} user={user}>
      <Typography variant="h4" mb={2}>{t('dashboard')}</Typography>
      <Typography variant="body1" mb={2}>{t('welcome')}, {user?.username || user?.email || t('signin')}!</Typography>
    </DashboardLayout>
  );
}

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Typography } from '@mui/material';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleSignout = async () => {
    await dispatch(signout());
    navigate('/signin');
  };

  return (
    <DashboardLayout onSignout={handleSignout} user={user}>
      <Typography variant="h4" mb={2}>Dashboard</Typography>
      <Typography variant="body1" mb={2}>Welcome, {user?.username || user?.email || 'User'}!</Typography>
    </DashboardLayout>
  );
}

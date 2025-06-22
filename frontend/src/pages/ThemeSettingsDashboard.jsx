import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import ThemeSettingsPage from './ThemeSettingsPage';
import { useDispatch, useSelector } from 'react-redux';
import { signout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function ThemeSettingsDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleSignout = async () => {
    await dispatch(signout());
    navigate('/signin');
  };

  return (
    <DashboardLayout onSignout={handleSignout} user={user}>
      <ThemeSettingsPage />
    </DashboardLayout>
  );
}

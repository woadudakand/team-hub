import React, { useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { store } from './app/store'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SigninPage from './pages/authentication/SigninPage'
import SignupPage from './pages/authentication/SignupPage'
import ForgotPasswordPage from './pages/authentication/ForgotPasswordPage'
import ResetPasswordPage from './pages/authentication/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import ThemeSettingsDashboard from './pages/ThemeSettingsDashboard'
import ProfilePage from './pages/profile/ProfilePage'
import GeneralInfoTab from './pages/profile/GeneralInfoTab'
import JobInfoTab from './pages/profile/JobInfoTab'
import AccountInfoTab from './pages/profile/AccountInfoTab'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import './App.css'
import AuthLoader from './features/auth/AuthLoader'
import ThemeMetaSync from './features/theme/ThemeMetaSync'
import { fetchThemeSettings } from './features/theme/themeSlice'
import DashboardLayout from './layout/DashboardLayout'
import SettingsPage from './pages/settings/SettingsPage';
import SettingsSideMenu from './pages/settings/SettingsSideMenu';
import TeamSettings from './pages/settings/TeamSettings';
import UserRoleSettings from './pages/settings/UserRoleSettings';
import ArchiveTab from './pages/settings/ArchiveTab';
import AnnouncementsPage from './pages/announcements/AnnouncementsPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectViewPage from './pages/projects/ProjectViewPage';
import ProjectStatusSettings from './pages/settings/ProjectStatusSettings';

function PrivateRoute({ children }) {
  const token = useSelector((state) => state.auth.token)
  return token ? children : <Navigate to="/signin" />
}

function App() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const { i18n } = useTranslation();
  useEffect(() => {
    dispatch(fetchThemeSettings());
  }, [dispatch]);

  // Set i18n language globally on app load and when theme.language changes
  useEffect(() => {
    if (theme.language && i18n.language !== theme.language) {
      i18n.changeLanguage(theme.language);
    }
  }, [theme.language, i18n]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AuthLoader>
                <ThemeMetaSync />
                <DashboardLayout />
              </AuthLoader>
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          {/* Settings route with nested subpages */}
          <Route path="settings" element={<SettingsPage />}>
            <Route path="theme-settings" element={<ThemeSettingsDashboard />} />
            <Route path="team" element={<TeamSettings />} />
            <Route path="team-archive" element={<ArchiveTab />} />
            <Route path="user-role" element={<UserRoleSettings />} />
            <Route path="project-status" element={<ProjectStatusSettings />} />
            <Route index element={<Navigate to="theme-settings" />} />
          </Route>
          <Route path="profile/:userId" element={<ProfilePage />}>
            <Route path="general-info" element={<GeneralInfoTab />} />
            <Route path="job-info" element={<JobInfoTab />} />
            <Route path="account-info" element={<AccountInfoTab />} />
            <Route index element={<Navigate to="general-info" />} />
          </Route>
          <Route path="profile" element={<ProfilePage />}>
            <Route path="general-info" element={<GeneralInfoTab />} />
            <Route path="job-info" element={<JobInfoTab />} />
            <Route path="account-info" element={<AccountInfoTab />} />
            <Route index element={<Navigate to="general-info" />} />
          </Route>
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:projectId" element={<ProjectViewPage />} />
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default function AppWithProvider() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

import React, { useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { store } from './app/store'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SigninPage from './pages/SigninPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import ThemeSettingsDashboard from './pages/ThemeSettingsDashboard'
import { useSelector } from 'react-redux'
import './App.css'
import AuthLoader from './features/auth/AuthLoader'
import ThemeMetaSync from './features/theme/ThemeMetaSync'
import { fetchThemeSettings } from './features/theme/themeSlice'

function PrivateRoute({ children }) {
  const token = useSelector((state) => state.auth.token)
  return token ? children : <Navigate to="/signin" />
}

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchThemeSettings());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AuthLoader>
        <ThemeMetaSync />
        <Routes>
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/theme-settings"
            element={
              <PrivateRoute>
                <ThemeSettingsDashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthLoader>
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

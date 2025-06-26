import React, { createContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

const NotificationContext = createContext();

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export { NotificationContext };

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, severity = 'success', duration = 4000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, severity, duration }]);
  }, []);

  const hideNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const success = useCallback((message, duration) => showNotification(message, 'success', duration), [showNotification]);
  const error = useCallback((message, duration) => showNotification(message, 'error', duration), [showNotification]);
  const warning = useCallback((message, duration) => showNotification(message, 'warning', duration), [showNotification]);
  const info = useCallback((message, duration) => showNotification(message, 'info', duration), [showNotification]);

  return (
    <NotificationContext.Provider value={{ success, error, warning, info }}>
      {children}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration}
          onClose={() => hideNotification(notification.id)}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{ mb: notifications.indexOf(notification) * 7 }}
        >
          <Alert 
            onClose={() => hideNotification(notification.id)} 
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
}

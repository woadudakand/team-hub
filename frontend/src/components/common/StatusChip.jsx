import React from 'react';
import { Chip } from '@mui/material';

const statusColors = {
  active: { color: 'success', label: 'Active' },
  inactive: { color: 'default', label: 'Inactive' },
  completed: { color: 'info', label: 'Completed' },
  cancelled: { color: 'error', label: 'Cancelled' },
  on_hold: { color: 'warning', label: 'On Hold' },
  planning: { color: 'default', label: 'Planning' },
  todo: { color: 'default', label: 'To Do' },
  in_progress: { color: 'primary', label: 'In Progress' },
  done: { color: 'success', label: 'Done' },
  // Add more status mappings as needed
};

export default function StatusChip({ status, variant = 'filled', size = 'small' }) {
  if (!status) return null;

  const statusConfig = statusColors[status.toLowerCase()] || {
    color: 'default',
    label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')
  };

  return (
    <Chip
      label={statusConfig.label}
      color={statusConfig.color}
      variant={variant}
      size={size}
      sx={{
        fontWeight: 500,
        textTransform: 'capitalize'
      }}
    />
  );
}

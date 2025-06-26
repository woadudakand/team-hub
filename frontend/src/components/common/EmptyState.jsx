import React from 'react';
import { Box, Typography, Button, SvgIcon } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SearchIcon from '@mui/icons-material/Search';

const iconMap = {
  add: AddIcon,
  folder: FolderOpenIcon,
  search: SearchIcon,
};

export default function EmptyState({ 
  icon = 'folder',
  title = 'No data found',
  description = 'Get started by adding your first item',
  actionLabel,
  onAction,
  sx = {}
}) {
  const IconComponent = iconMap[icon] || FolderOpenIcon;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 8,
        px: 4,
        textAlign: 'center',
        ...sx
      }}
    >
      <SvgIcon 
        component={IconComponent} 
        sx={{ 
          fontSize: 64, 
          color: 'text.secondary', 
          mb: 2,
          opacity: 0.5
        }} 
      />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAction}
          size="large"
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

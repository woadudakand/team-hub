import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function Loader({ size = 48, message }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={200}>
      <CircularProgress size={size} />
      {message && <Box mt={2}>{message}</Box>}
    </Box>
  );
}

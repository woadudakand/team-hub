import React from 'react';
import { Box, Skeleton, Card, CardContent } from '@mui/material';

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <Box>
      {/* Header skeleton */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 2 }}>
        <Skeleton variant="rectangular" width={24} height={24} />
        <Skeleton variant="text" width="20%" />
        <Box sx={{ flexGrow: 1 }} />
        <Skeleton variant="rectangular" width={300} height={40} />
      </Box>

      {/* Table rows skeleton */}
      {Array.from({ length: rows }).map((_, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, p: 2, alignItems: 'center' }}>
          <Skeleton variant="rectangular" width={24} height={24} />
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Box key={colIndex} sx={{ flex: 1 }}>
              <Skeleton variant="text" width={colIndex === 0 ? '60%' : '80%'} />
            </Box>
          ))}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} sx={{ minWidth: 300, flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="rectangular" width={60} height={24} />
            </Box>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Skeleton variant="rectangular" width={80} height={32} />
              <Skeleton variant="rectangular" width={80} height={32} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export function FormSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <Skeleton variant="text" width="30%" height={32} sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Skeleton variant="rectangular" width="100%" height={56} />
        <Skeleton variant="rectangular" width="100%" height={120} />
        <Skeleton variant="rectangular" width="100%" height={56} />
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
        <Skeleton variant="rectangular" width={80} height={36} />
        <Skeleton variant="rectangular" width={80} height={36} />
      </Box>
    </Box>
  );
}

export default function LoadingSkeleton({ variant = 'table', ...props }) {
  switch (variant) {
    case 'table':
      return <TableSkeleton {...props} />;
    case 'card':
      return <CardSkeleton {...props} />;
    case 'form':
      return <FormSkeleton {...props} />;
    default:
      return <TableSkeleton {...props} />;
  }
}

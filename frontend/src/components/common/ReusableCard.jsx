import React from 'react';
import { Card, CardContent, Box, Button, Typography, Divider, Tabs, Tab } from '@mui/material';

export default function ReusableCard({ title, subtitle, onAdd, addLabel, children, tabLabel, onTabChange, tabValue }) {
  return (
    <Card>
      <Box display="flex" alignItems="center" justifyContent="space-between" px={2} py={2}>
        <Typography variant="h6">{title}</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          {subtitle && <Typography variant="subtitle1" color="text.secondary">{subtitle}</Typography>}
          {onTabChange && (
            <Tabs value={tabValue} onChange={(_, v) => onTabChange(v)} size="small">
              <Tab label={tabLabel || ''} />
            </Tabs>
          )}
          {onAdd && <Button variant="contained" onClick={onAdd}>{addLabel || 'Add'}</Button>}
        </Box>
      </Box>
      <Divider />
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

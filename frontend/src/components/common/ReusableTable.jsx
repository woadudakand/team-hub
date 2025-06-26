import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, TablePagination,
  Box, IconButton, TextField, InputAdornment, Skeleton, Typography, Chip, Button, Toolbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export default function ReusableTable({
  columns, rows, selected, onSelectAll, onSelectRow, onDeleteSelected, page, rowsPerPage, total,
  onPageChange, onRowsPerPageChange, onSearch, searchValue, actions, loading, multiActionLabel, onMultiAction
}) {
  const SkeletonRows = () => (
    Array.from({ length: rowsPerPage }).map((_, index) => (
      <TableRow key={index}>
        <TableCell padding="checkbox">
          <Skeleton variant="rectangular" width={24} height={24} />
        </TableCell>
        {columns.map(col => (
          <TableCell key={col.key}>
            <Skeleton variant="text" width="80%" />
          </TableCell>
        ))}
        {actions && (
          <TableCell>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          </TableCell>
        )}
      </TableRow>
    ))
  );

  const EmptyState = () => (
    <TableRow>
      <TableCell colSpan={columns.length + (actions ? 2 : 1)} align="center" sx={{ py: 6 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {searchValue ? 'No results found' : 'No data available'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {searchValue ? 'Try adjusting your search criteria' : 'Get started by adding your first item'}
        </Typography>
      </TableCell>
    </TableRow>
  );

  return (
    <Box>
      <Toolbar sx={{ pl: 0, pr: 0, minHeight: '64px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Checkbox
            indeterminate={selected.length > 0 && selected.length < rows.length}
            checked={rows.length > 0 && selected.length === rows.length}
            onChange={onSelectAll}
            inputProps={{ 'aria-label': 'select all' }}
          />
          {selected.length > 0 && (
            <>
              <Chip
                label={`${selected.length} selected`}
                size="small"
                color="primary"
                variant="outlined"
              />
              {multiActionLabel && onMultiAction && (
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  size="small"
                  onClick={onMultiAction}
                  variant="outlined"
                >
                  {multiActionLabel}
                </Button>
              )}
            </>
          )}
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <TextField
          size="small"
          placeholder="Search..."
          value={searchValue || ''}
          onChange={e => onSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => onSearch('')}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              {columns.map(col => (
                <TableCell key={col.key} sx={{ fontWeight: 600 }}>
                  {col.label}
                </TableCell>
              ))}
              {actions && <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <SkeletonRows />
            ) : rows.length === 0 ? (
              <EmptyState />
            ) : (
              rows.map((row, idx) => (
                <TableRow
                  key={row.id || idx}
                  selected={selected.includes(row.id)}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onChange={() => onSelectRow(row.id)}
                    />
                  </TableCell>
                  {columns.map(col => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(row) : row[col.key]}
                    </TableCell>
                  ))}
                  {actions && <TableCell>{actions(row)}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Box>
  );
}

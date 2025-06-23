import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, TablePagination, Box, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ReusableTable({
  columns, rows, selected, onSelectAll, onSelectRow, onDeleteSelected, page, rowsPerPage, total, onPageChange, onRowsPerPageChange, onSearch, searchValue, actions
}) {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Checkbox
            indeterminate={selected.length > 0 && selected.length < rows.length}
            checked={rows.length > 0 && selected.length === rows.length}
            onChange={onSelectAll}
            inputProps={{ 'aria-label': 'select all' }}
          />
          {selected.length > 0 && (
            <IconButton color="error" onClick={onDeleteSelected}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
        <Box>
          <input
            type="search"
            placeholder="Search..."
            value={searchValue}
            onChange={e => onSearch(e.target.value)}
            style={{ padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              {columns.map(col => (
                <TableCell key={col.key}>{col.label}</TableCell>
              ))}
              {actions && <TableCell style={{ minWidth: 90 }}>Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={row.id || idx} selected={selected.includes(row.id)}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(row.id)}
                    onChange={() => onSelectRow(row.id)}
                  />
                </TableCell>
                {columns.map(col => (
                  <TableCell key={col.key}>{row[col.key]}</TableCell>
                ))}
                {actions && <TableCell style={{ minWidth: 90 }}>{actions(row)}</TableCell>}
              </TableRow>
            ))}
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

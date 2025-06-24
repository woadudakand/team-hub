import React, { useEffect, useState } from 'react';
import ReusableTable from '../../components/common/ReusableTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { fetchProjectStatuses, createProjectStatus, updateProjectStatus, deleteProjectStatuses, restoreProjectStatuses } from '../../utility/projectStatusService';
import { Button, Card, CardContent, Divider, Typography, Box, IconButton, Tabs, Tab, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';

export default function ProjectStatusSettings() {
  const [statuses, setStatuses] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMultiOpen, setConfirmMultiOpen] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [addValue, setAddValue] = useState('');
  const [archiveTab, setArchiveTab] = useState(false);
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);
  const [statusToRestore, setStatusToRestore] = useState(null);
  const [confirmMultiRestoreOpen, setConfirmMultiRestoreOpen] = useState(false);

  const columns = [
    { key: 'sl', label: 'SL' },
    { key: 'status', label: 'Status' },
  ];
  const rows = statuses.map((status, idx) => ({ ...status, sl: page * rowsPerPage + idx + 1 }));

  const fetchData = async () => {
    setLoading(true);
    const result = await fetchProjectStatuses({ page: page + 1, limit: rowsPerPage, search, archived: archiveTab });
    setStatuses(result.rows || []);
    setTotal(result.total || 0);
    setSelected([]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, rowsPerPage, search, archiveTab]);

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelected(statuses.map(s => s.id));
    else setSelected([]);
  };
  const handleSelectRow = (id) => {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };
  const handleDeleteSelected = () => {
    if (selected.length === 0) return;
    setConfirmMultiOpen(true);
  };
  const handleConfirmMultiDelete = async () => {
    if (selected.length > 0) {
      await deleteProjectStatuses(selected);
      setSelected([]);
      setConfirmMultiOpen(false);
      fetchData();
    } else {
      setConfirmMultiOpen(false);
    }
  };
  const handleDeleteStatus = (status) => {
    setStatusToDelete(status);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (statusToDelete) {
      await deleteProjectStatuses([statusToDelete.id]);
      setStatusToDelete(null);
      setConfirmOpen(false);
      fetchData();
    }
  };
  const handleCancelDelete = () => {
    setStatusToDelete(null);
    setConfirmOpen(false);
  };
  const handleCancelMultiDelete = () => {
    setConfirmMultiOpen(false);
  };
  const handlePageChange = (_, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };
  const handleSearch = (val) => { setSearch(val); setPage(0); };
  const handleTabChange = (event, newValue) => {
    setArchiveTab(newValue === 1);
    setSelected([]);
    setPage(0);
  };
  const handleRestoreStatus = (status) => {
    setStatusToRestore(status);
    setConfirmRestoreOpen(true);
  };
  const handleConfirmRestore = async () => {
    if (statusToRestore) {
      await restoreProjectStatuses([statusToRestore.id]);
      setStatusToRestore(null);
      setConfirmRestoreOpen(false);
      fetchData();
    }
  };
  const handleCancelRestore = () => {
    setStatusToRestore(null);
    setConfirmRestoreOpen(false);
  };
  const handleRestoreSelected = () => {
    if (selected.length === 0) return;
    setConfirmMultiRestoreOpen(true);
  };
  const handleConfirmMultiRestore = async () => {
    if (selected.length > 0) {
      await restoreProjectStatuses(selected);
      setSelected([]);
      setConfirmMultiRestoreOpen(false);
      fetchData();
    } else {
      setConfirmMultiRestoreOpen(false);
    }
  };
  const handleCancelMultiRestore = () => {
    setConfirmMultiRestoreOpen(false);
  };
  const handleEdit = (status) => {
    setEditId(status.id);
    setEditValue(status.status);
  };
  const handleEditSave = async () => {
    if (editId && editValue) {
      await updateProjectStatus(editId, { status: editValue });
      setEditId(null);
      setEditValue('');
      fetchData();
    }
  };
  const handleEditCancel = () => {
    setEditId(null);
    setEditValue('');
  };
  const handleAdd = async () => {
    if (addValue) {
      await createProjectStatus({ status: addValue });
      setAddValue('');
      fetchData();
    }
  };

  return (
    <Card>
      <Box display="flex" alignItems="center" justifyContent="space-between" px={2} py={2}>
        <Typography variant="h6">Project Status Management</Typography>
        <Tabs value={archiveTab ? 1 : 0} onChange={handleTabChange} size="small">
          <Tab label="Active Statuses" />
          <Tab label="Archived Statuses" />
        </Tabs>
        <Box display="flex" gap={1}>
          <TextField size="small" label="New Status" value={addValue} onChange={e => setAddValue(e.target.value)} />
          <Button variant="contained" onClick={handleAdd}>Add</Button>
        </Box>
      </Box>
      <Divider />
      <CardContent>
        <ReusableTable
          columns={columns}
          rows={rows}
          selected={selected}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onDeleteSelected={archiveTab ? null : handleDeleteSelected}
          page={page}
          rowsPerPage={rowsPerPage}
          total={total}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onSearch={handleSearch}
          searchValue={search}
          actions={row => (
            archiveTab ? (
              <IconButton color="primary" onClick={() => handleRestoreStatus(row)} size="small"><RestoreIcon /></IconButton>
            ) : (
              editId === row.id ? (
                <>
                  <TextField size="small" value={editValue} onChange={e => setEditValue(e.target.value)} sx={{ mr: 1 }} />
                  <Button size="small" onClick={handleEditSave}>Save</Button>
                  <Button size="small" onClick={handleEditCancel}>Cancel</Button>
                </>
              ) : (
                <>
                  <IconButton color="primary" onClick={() => handleEdit(row)} size="small"><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDeleteStatus(row)} size="small"><DeleteIcon /></IconButton>
                </>
              )
            )
          )}
          loading={loading}
          multiActionLabel={selected.length > 0 ? (archiveTab ? 'Restore Selected' : 'Delete Selected') : undefined}
          onMultiAction={archiveTab ? handleRestoreSelected : handleDeleteSelected}
        />
      </CardContent>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Status"
        content={statusToDelete ? `Are you sure you want to delete '${statusToDelete.status}'?` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
      <ConfirmDialog
        open={confirmMultiOpen}
        title="Delete Selected Statuses"
        content={selected.length > 0 ? `Are you sure you want to delete ${selected.length} selected status(es)?` : ''}
        onConfirm={handleConfirmMultiDelete}
        onCancel={handleCancelMultiDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
      <ConfirmDialog
        open={confirmRestoreOpen}
        title="Restore Status"
        content={statusToRestore ? `Are you sure you want to restore '${statusToRestore.status}'?` : ''}
        onConfirm={handleConfirmRestore}
        onCancel={handleCancelRestore}
        confirmLabel="Restore"
        cancelLabel="Cancel"
      />
      <ConfirmDialog
        open={confirmMultiRestoreOpen}
        title="Restore Selected Statuses"
        content={selected.length > 0 ? `Are you sure you want to restore ${selected.length} selected status(es)?` : ''}
        onConfirm={handleConfirmMultiRestore}
        onCancel={handleCancelMultiRestore}
        confirmLabel="Restore"
        cancelLabel="Cancel"
      />
    </Card>
  );
}

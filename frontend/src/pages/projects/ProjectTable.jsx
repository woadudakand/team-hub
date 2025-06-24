import React, { useEffect, useState } from 'react';
import ReusableTable from '../../components/common/ReusableTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { fetchProjects, deleteProject } from '../../utility/projectService';
import { Button, Card, CardContent, Divider, Typography, Box, Link as MuiLink, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProjectTable({ onEdit }) {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMultiOpen, setConfirmMultiOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const columns = [
    { key: 'sl', label: 'SL' },
    { key: 'name', label: 'Name', render: (row) => (
      <MuiLink component={Link} to={`/projects/${row.id}`} underline="hover">{row.name}</MuiLink>
    ) },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' },
  ];
  const rows = projects.map((project, idx) => ({ ...project, sl: page * rowsPerPage + idx + 1 }));

  const fetchData = async () => {
    setLoading(true);
    const result = await fetchProjects({ page: page + 1, limit: rowsPerPage, search });
    setProjects(result.data);
    setTotal(result.total);
    setSelected([]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, rowsPerPage, search]);

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelected(projects.map(p => p.id));
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
      await Promise.all(selected.map(id => deleteProject(id)));
      setSelected([]);
      setConfirmMultiOpen(false);
      fetchData();
    } else {
      setConfirmMultiOpen(false);
    }
  };
  const handleDeleteProject = (project) => {
    setProjectToDelete(project);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      await deleteProject(projectToDelete.id);
      setProjectToDelete(null);
      setConfirmOpen(false);
      fetchData();
    }
  };
  const handleCancelDelete = () => {
    setProjectToDelete(null);
    setConfirmOpen(false);
  };
  const handleCancelMultiDelete = () => {
    setConfirmMultiOpen(false);
  };
  const handlePageChange = (_, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };
  const handleSearch = (val) => { setSearch(val); setPage(0); };

  return (
    <Card>
      <Box display="flex" alignItems="center" justifyContent="space-between" px={2} py={2}>
        <Typography variant="h6">Project Management</Typography>
        {/* Add button can be placed here if needed */}
      </Box>
      <Divider />
      <CardContent>
        <ReusableTable
          columns={columns}
          rows={rows}
          selected={selected}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onDeleteSelected={handleDeleteSelected}
          page={page}
          rowsPerPage={rowsPerPage}
          total={total}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onSearch={handleSearch}
          searchValue={search}
          actions={row => (
            <>
              <Tooltip title="View"><IconButton size="small" component={Link} to={`/projects/${row.id}`}><VisibilityIcon /></IconButton></Tooltip>
              <Tooltip title="Edit"><IconButton size="small" onClick={() => onEdit(row)}><EditIcon /></IconButton></Tooltip>
              <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDeleteProject(row)}><DeleteIcon /></IconButton></Tooltip>
            </>
          )}
          loading={loading}
          multiActionLabel={selected.length > 0 ? 'Delete Selected' : undefined}
          onMultiAction={handleDeleteSelected}
        />
      </CardContent>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Project"
        content={projectToDelete ? `Are you sure you want to delete '${projectToDelete.name}'? This action cannot be undone.` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
      <ConfirmDialog
        open={confirmMultiOpen}
        title="Delete Selected Projects"
        content={selected.length > 0 ? `Are you sure you want to delete ${selected.length} selected project(s)? This action cannot be undone.` : ''}
        onConfirm={handleConfirmMultiDelete}
        onCancel={handleCancelMultiDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </Card>
  );
}

import React, { useEffect, useState } from 'react';
import ReusableTable from '../../components/common/ReusableTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import { fetchProjects, deleteProject } from '../../utility/projectService';
import { Box, Link as MuiLink, IconButton, Tooltip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotification } from '../../hooks/useNotification';

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
  const { success, error } = useNotification();

  const columns = [
    { key: 'sl', label: 'SL' },
    { key: 'name', label: 'Name', render: (row) => (
      <MuiLink component={Link} to={`/projects/${row.id}`} underline="hover" sx={{ fontWeight: 500 }}>
        {row.name}
      </MuiLink>
    ) },
    { key: 'description', label: 'Description', render: (row) => (
      <Box sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {row.description || '-'}
      </Box>
    ) },
    { key: 'status', label: 'Status', render: (row) => (
      <StatusChip status={row.status} />
    ) },
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
      try {
        await Promise.all(selected.map(id => deleteProject(id)));
        success(`Successfully deleted ${selected.length} project(s)`);
        setSelected([]);
        setConfirmMultiOpen(false);
        fetchData();
      } catch {
        error('Failed to delete selected projects');
      }
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
      try {
        await deleteProject(projectToDelete.id);
        success(`Successfully deleted project "${projectToDelete.name}"`);
        setProjectToDelete(null);
        setConfirmOpen(false);
        fetchData();
      } catch {
        error('Failed to delete project');
      }
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
    <Box>
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
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="View">
              <IconButton 
                size="small" 
                component={Link} 
                to={`/projects/${row.id}`}
                sx={{ color: 'primary.main' }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton 
                size="small" 
                onClick={() => onEdit(row)}
                sx={{ color: 'info.main' }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => handleDeleteProject(row)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        loading={loading}
        multiActionLabel={selected.length > 0 ? 'Delete Selected' : undefined}
        onMultiAction={handleDeleteSelected}
      />
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
    </Box>
  );
}

import React, { useEffect, useState } from 'react';
import ReusableCard from '../../components/common/ReusableCard';
import ReusableTable from '../../components/common/ReusableTable';
import { DataService as axios } from '../../utility/dataService';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import IconButton from '@mui/material/IconButton';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import RoleModal from '../../components/common/RoleModal';

export default function UserRoleSettings() {
  const { t } = useTranslation();
  const [roles, setRoles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMultiOpen, setConfirmMultiOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalRole, setModalRole] = useState(null);
  const [archiveTab, setArchiveTab] = useState(false);
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);
  const [roleToRestore, setRoleToRestore] = useState(null);
  const [confirmMultiRestoreOpen, setConfirmMultiRestoreOpen] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    const { data } = await axios.get(`/user-role-list?search=${search}&limit=${rowsPerPage}&offset=${page * rowsPerPage}&archived=${archiveTab}`);
    setRoles(data.rows || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line
  }, [page, rowsPerPage, search, archiveTab]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(roles.map(r => r.id));
    } else {
      setSelected([]);
    }
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
      await axios.delete('/user-role', { ids: selected });
      setSelected([]);
      setConfirmMultiOpen(false);
      fetchRoles();
    } else {
      setConfirmMultiOpen(false);
    }
  };
  const handleAddRole = () => {
    setModalMode('add');
    setModalRole(null);
    setModalOpen(true);
  };
  const handleEditRole = (role) => {
    setModalMode('edit');
    setModalRole(role);
    setModalOpen(true);
  };
  const handleDeleteRole = (role) => {
    setRoleToDelete(role);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (roleToDelete) {
      await axios.delete('/user-role', { ids: [roleToDelete.id] });
      setRoleToDelete(null);
      setConfirmOpen(false);
      fetchRoles();
    }
  };
  const handleCancelDelete = () => {
    setRoleToDelete(null);
    setConfirmOpen(false);
  };
  const handleCancelMultiDelete = () => {
    setConfirmMultiOpen(false);
  };
  const handleModalSubmit = async (data) => {
    if (modalMode === 'add') {
      await axios.post('/user-role', data);
    } else if (modalMode === 'edit' && modalRole) {
      await axios.patch(`/user-role/${modalRole.id}`, data);
    }
    setModalOpen(false);
    fetchRoles();
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };
  // Archive/Restore logic
  const handleTabChange = () => {
    setArchiveTab(!archiveTab);
    setSelected([]);
    setPage(0);
  };
  const handleRestoreRole = (role) => {
    setRoleToRestore(role);
    setConfirmRestoreOpen(true);
  };
  const handleConfirmRestore = async () => {
    if (roleToRestore) {
      await axios.patch('/user-role/restore', { ids: [roleToRestore.id] });
      setRoleToRestore(null);
      setConfirmRestoreOpen(false);
      fetchRoles();
    }
  };
  const handleCancelRestore = () => {
    setRoleToRestore(null);
    setConfirmRestoreOpen(false);
  };
  const handleRestoreSelected = () => {
    if (selected.length === 0) return;
    setConfirmMultiRestoreOpen(true);
  };
  const handleConfirmMultiRestore = async () => {
    if (selected.length > 0) {
      await axios.patch('/user-role/restore', { ids: selected });
      setSelected([]);
      setConfirmMultiRestoreOpen(false);
      fetchRoles();
    } else {
      setConfirmMultiRestoreOpen(false);
    }
  };
  const handleCancelMultiRestore = () => {
    setConfirmMultiRestoreOpen(false);
  };

  const columns = [
    { key: 'sl', label: 'SL' },
    { key: 'name', label: t('role') },
  ];
  const rows = roles.map((role, idx) => ({ ...role, sl: page * rowsPerPage + idx + 1 }));

  return (
    <>
      <ReusableCard
        title={archiveTab ? t('archivedRoles') : t('role')}
        onAdd={archiveTab ? null : handleAddRole}
        addLabel={t('addRole')}
        tabLabel={archiveTab ? t('activeRoles') : t('archivedRoles')}
        onTabChange={handleTabChange}
        tabValue={archiveTab ? 1 : 0}
      >
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
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          onSearch={setSearch}
          searchValue={search}
          actions={row => (
            archiveTab ? (
              <IconButton color="primary" onClick={() => handleRestoreRole(row)} size="small"><RestoreIcon /></IconButton>
            ) : (
              <>
                <IconButton color="primary" onClick={() => handleEditRole(row)} size="small"><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => handleDeleteRole(row)} size="small"><DeleteIcon /></IconButton>
              </>
            )
          )}
          loading={loading}
          multiActionLabel={selected.length > 0 ? (archiveTab ? t('restoreSelected') : t('deleteSelected')) : undefined}
          onMultiAction={archiveTab ? handleRestoreSelected : handleDeleteSelected}
        />
      </ReusableCard>
      <RoleModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialValues={modalMode === 'edit' && modalRole ? { name: modalRole.name } : {}}
        mode={modalMode}
      />
      <ConfirmDialog
        open={confirmOpen}
        title={t('delete') + ' ' + t('role')}
        content={roleToDelete ? `${t('areYouSureDelete')} '${roleToDelete.name}'?` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
      />
      <ConfirmDialog
        open={confirmMultiOpen}
        title={t('delete') + ' ' + t('role')}
        content={selected.length > 0 ? `${t('areYouSureDelete')} ${selected.length} ${t('role')}${selected.length > 1 ? 's' : ''}?` : ''}
        onConfirm={handleConfirmMultiDelete}
        onCancel={handleCancelMultiDelete}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
      />
      <ConfirmDialog
        open={confirmRestoreOpen}
        title={t('restore') + ' ' + t('role')}
        content={roleToRestore ? `${t('areYouSureRestore')} '${roleToRestore.name}'?` : ''}
        onConfirm={handleConfirmRestore}
        onCancel={handleCancelRestore}
        confirmLabel={t('restore')}
        cancelLabel={t('cancel')}
      />
      <ConfirmDialog
        open={confirmMultiRestoreOpen}
        title={t('restore') + ' ' + t('role')}
        content={selected.length > 0 ? `${t('areYouSureRestore')} ${selected.length} ${t('role')}${selected.length > 1 ? 's' : ''}?` : ''}
        onConfirm={handleConfirmMultiRestore}
        onCancel={handleCancelMultiRestore}
        confirmLabel={t('restore')}
        cancelLabel={t('cancel')}
      />
    </>
  );
}

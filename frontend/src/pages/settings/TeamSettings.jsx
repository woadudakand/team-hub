import React, { useEffect, useState } from 'react';
import ReusableCard from '../../components/common/ReusableCard';
import ReusableTable from '../../components/common/ReusableTable';
import { DataService as axios } from '../../utility/dataService';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import TeamModal from '../../components/common/TeamModal';

export default function TeamSettings() {
  const { t } = useTranslation();
  const [teams, setTeams] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMultiOpen, setConfirmMultiOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalTeam, setModalTeam] = useState(null);

  const fetchTeams = async () => {
    setLoading(true);
    const { data } = await axios.get(`/team-list?search=${search}&limit=${rowsPerPage}&offset=${page * rowsPerPage}`);
    setTeams(data.rows || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line
  }, [page, rowsPerPage, search]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(teams.map(t => t.id));
    } else {
      setSelected([]);
    }
  };
  const handleSelectRow = (id) => {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };
  const handleDeleteSelected = () => {
    if (selected.length === 0) return; // Prevent opening dialog if nothing selected
    setConfirmMultiOpen(true);
  };
  const handleConfirmMultiDelete = async () => {
    if (selected.length > 0) {
      await axios.delete('/team', { ids: selected });
      setSelected([]);
      setConfirmMultiOpen(false);
      fetchTeams();
    } else {
      setConfirmMultiOpen(false);
    }
  };
  const handleAddTeam = () => {
    setModalMode('add');
    setModalTeam(null);
    setModalOpen(true);
  };
  const handleEditTeam = (team) => {
    setModalMode('edit');
    setModalTeam(team);
    setModalOpen(true);
  };
  const handleDeleteTeam = (team) => {
    setTeamToDelete(team);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (teamToDelete) {
      await axios.delete('/team', { ids: [teamToDelete.id] });
      setTeamToDelete(null);
      setConfirmOpen(false);
      fetchTeams();
    }
  };
  const handleCancelDelete = () => {
    setTeamToDelete(null);
    setConfirmOpen(false);
  };
  const handleCancelMultiDelete = () => {
    setConfirmMultiOpen(false);
  };
  const handleModalSubmit = async (data) => {
    if (modalMode === 'add') {
      await axios.post('/team', data);
    } else if (modalMode === 'edit' && modalTeam) {
      await axios.patch(`/team/${modalTeam.id}`, data);
    }
    setModalOpen(false);
    fetchTeams();
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const columns = [
    { key: 'sl', label: 'SL' },
    { key: 'title', label: t('team') },
  ];
  const rows = teams.map((team, idx) => ({ ...team, sl: page * rowsPerPage + idx + 1 }));

  return (
    <>
      <ReusableCard title={t('team')} onAdd={handleAddTeam} addLabel={t('addTeam')}>
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
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          onSearch={setSearch}
          searchValue={search}
          actions={row => (
            <>
              <IconButton color="primary" onClick={() => handleEditTeam(row)} size="small"><EditIcon /></IconButton>
              <IconButton color="error" onClick={() => handleDeleteTeam(row)} size="small"><DeleteIcon /></IconButton>
            </>
          )}
          loading={loading}
        />
      </ReusableCard>
      <TeamModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialValues={modalMode === 'edit' && modalTeam ? { name: modalTeam.title, description: modalTeam.description } : {}}
        mode={modalMode}
      />
      <ConfirmDialog
        open={confirmOpen}
        title={t('delete') + ' ' + t('team')}
        content={teamToDelete ? `${t('areYouSureDelete')} '${teamToDelete.title}'?` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
      />
      <ConfirmDialog
        open={confirmMultiOpen}
        title={t('delete') + ' ' + t('team')}
        content={selected.length > 0 ? `${t('areYouSureDelete')} ${selected.length} ${t('team')}${selected.length > 1 ? 's' : ''}?` : ''}
        onConfirm={handleConfirmMultiDelete}
        onCancel={handleCancelMultiDelete}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
      />
    </>
  );
}

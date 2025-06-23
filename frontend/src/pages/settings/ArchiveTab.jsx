import React, { useEffect, useState } from 'react';
import ReusableCard from '../../components/common/ReusableCard';
import ReusableTable from '../../components/common/ReusableTable';
import { DataService as axios } from '../../utility/dataService';
import { useTranslation } from 'react-i18next';
import RestoreIcon from '@mui/icons-material/Restore';
import IconButton from '@mui/material/IconButton';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function ArchiveTab() {
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
  const [teamToRestore, setTeamToRestore] = useState(null);

  const fetchArchivedTeams = async () => {
    setLoading(true);
    const { data } = await axios.get(`/team-list?search=${search}&limit=${rowsPerPage}&offset=${page * rowsPerPage}&archived=true`);
    setTeams(data.rows || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchArchivedTeams();
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
  const handleRestoreTeam = (team) => {
    setTeamToRestore(team);
    setConfirmOpen(true);
  };
  const handleConfirmRestore = async () => {
    if (teamToRestore) {
      await axios.patch('/team/restore', { ids: [teamToRestore.id] });
      setTeamToRestore(null);
      setConfirmOpen(false);
      fetchArchivedTeams();
    }
  };
  const handleCancelRestore = () => {
    setTeamToRestore(null);
    setConfirmOpen(false);
  };
  const handleRestoreSelected = () => {
    if (selected.length === 0) return;
    setConfirmMultiOpen(true);
  };
  const handleConfirmMultiRestore = async () => {
    if (selected.length > 0) {
      await axios.patch('/team/restore', { ids: selected });
      setSelected([]);
      setConfirmMultiOpen(false);
      fetchArchivedTeams();
    } else {
      setConfirmMultiOpen(false);
    }
  };
  const handleCancelMultiRestore = () => {
    setConfirmMultiOpen(false);
  };

  const columns = [
    { key: 'sl', label: 'SL' },
    { key: 'title', label: t('team') },
  ];
  const rows = teams.map((team, idx) => ({ ...team, sl: page * rowsPerPage + idx + 1 }));

  return (
    <>
      <ReusableCard title={t('archivedTeams')} onAdd={null} addLabel={null}>
        <ReusableTable
          columns={columns}
          rows={rows}
          selected={selected}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onDeleteSelected={null}
          page={page}
          rowsPerPage={rowsPerPage}
          total={total}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          onSearch={setSearch}
          searchValue={search}
          actions={row => (
            <IconButton color="primary" onClick={() => handleRestoreTeam(row)} size="small"><RestoreIcon /></IconButton>
          )}
          loading={loading}
          multiActionLabel={selected.length > 0 ? t('restoreSelected') : undefined}
          onMultiAction={handleRestoreSelected}
        />
      </ReusableCard>
      <ConfirmDialog
        open={confirmOpen}
        title={t('restore') + ' ' + t('team')}
        content={teamToRestore ? `${t('areYouSureRestore')} '${teamToRestore.title}'?` : ''}
        onConfirm={handleConfirmRestore}
        onCancel={handleCancelRestore}
        confirmLabel={t('restore')}
        cancelLabel={t('cancel')}
      />
      <ConfirmDialog
        open={confirmMultiOpen}
        title={t('restore') + ' ' + t('team')}
        content={selected.length > 0 ? `${t('areYouSureRestore')} ${selected.length} ${t('team')}${selected.length > 1 ? 's' : ''}?` : ''}
        onConfirm={handleConfirmMultiRestore}
        onCancel={handleCancelMultiRestore}
        confirmLabel={t('restore')}
        cancelLabel={t('cancel')}
      />
    </>
  );
}

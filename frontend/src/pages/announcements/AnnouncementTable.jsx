import React, { useEffect, useState } from 'react';
import ReusableCard from '../../components/common/ReusableCard';
import ReusableTable from '../../components/common/ReusableTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import AnnouncementForm from './AnnouncementForm';
import { fetchAnnouncements, deleteAnnouncement } from '../../utility/dataService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';

export default function AnnouncementTable() {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAnnouncement, setModalAnnouncement] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const result = await fetchAnnouncements({ page: page + 1, limit: rowsPerPage, search });
    setAnnouncements(result.data);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, search]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(announcements.map(a => a.id));
    } else {
      setSelected([]);
    }
  };
  const handleSelectRow = (id) => {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };
  const handleDeleteSelected = () => {
    if (selected.length === 0) return;
    setConfirmOpen(true);
  };
  const handleDelete = (id) => {
    setAnnouncementToDelete(id);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (announcementToDelete) {
      await deleteAnnouncement(announcementToDelete);
      setAnnouncementToDelete(null);
    } else if (selected.length) {
      await Promise.all(selected.map(id => deleteAnnouncement(id)));
      setSelected([]);
    }
    setConfirmOpen(false);
    fetchData();
  };
  const handleEdit = (row) => {
    setModalAnnouncement(row);
    setModalOpen(true);
  };
  const handleAdd = () => {
    setModalAnnouncement(null);
    setModalOpen(true);
  };
  const handleFormClose = (refresh) => {
    setModalOpen(false);
    setModalAnnouncement(null);
    if (refresh) fetchData();
  };
  // Pagination handlers
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };
  const handleSearch = (newSearch) => {
    setSearch(newSearch);
    setPage(0); // Reset to first page when search changes
  };
  const columns = [
    { key: 'title', label: t('title') },
    { key: 'description', label: t('description') },
    { key: 'start_date', label: t('startDate') },
    { key: 'end_date', label: t('endDate') },
    { key: 'files', label: t('files') },
  ];
  return (
    <ReusableCard title={t('announcements')} onAdd={handleAdd} addLabel={t('addAnnouncement')}>
      <ReusableTable
        columns={columns}
        rows={announcements}
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
        actions={(row) => (
          <>
            <IconButton onClick={() => handleEdit(row)}><EditIcon /></IconButton>
            <IconButton onClick={() => handleDelete(row.id)}><DeleteIcon /></IconButton>
          </>
        )}
      />
      {modalOpen && <AnnouncementForm open={modalOpen} onClose={handleFormClose} editData={modalAnnouncement} />}
      <ConfirmDialog
        open={confirmOpen}
        title={t('confirmDelete')}
        content={t('areYouSureDelete')}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setAnnouncementToDelete(null); }}
      />
    </ReusableCard>
  );
}

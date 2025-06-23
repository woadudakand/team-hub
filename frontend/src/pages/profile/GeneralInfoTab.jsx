import React, { useState, useEffect } from 'react';
import { DataService as axios } from '../../utility/dataService';
import { Box, TextField, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { useTranslation } from 'react-i18next';

export default function GeneralInfoTab() {
  const { t } = useTranslation();
  const { userId } = useParams();
  const loggedInUser = useSelector((state) => state.auth.user);
  const actualUserId = userId || loggedInUser?.id;
  const isOwn = actualUserId === loggedInUser?.id;
  const isSuperadmin = loggedInUser?.role === 'superadmin';
  const canEdit = isOwn || isSuperadmin;

  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [userRes, genRes] = await Promise.all([
        axios.get(`/users/${actualUserId}`),
        axios.get(`/general-info/${actualUserId}`),
      ]);

      const user = userRes.data || {};
      const gen = genRes.data || {};
      // Format date_of_birth for input type="date"
      let date_of_birth = gen.date_of_birth || '';
      if (date_of_birth && date_of_birth.length > 10) {
        date_of_birth = date_of_birth.slice(0, 10);
      }
      setForm({
        ...gen,
        date_of_birth,
        f_name: user.f_name || '',
        l_name: user.l_name || '',
        user_id: actualUserId
      });
      setLoading(false);
    }

    if(actualUserId) {
      fetchData();
    }
  }, [actualUserId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.put(`/general-info/${form.user_id}`, form);
      setEditing(false);
      setForm({ ...form, ...data });
    } catch (err) {
      alert('Failed to update general info');
    }
  };

  if (loading || !form) return <Loader message={t('loadingGeneralInfo')} />;

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField label={t('firstName')} name="f_name" value={form.f_name || ''} onChange={handleChange} disabled={!canEdit || !editing} />
      <TextField label={t('lastName')} name="l_name" value={form.l_name || ''} onChange={handleChange} disabled={!canEdit || !editing} />
      <TextField label={t('mailingAddress')} name="mailing_address" value={form.mailing_address || ''} onChange={handleChange} disabled={!canEdit || !editing} />
      <TextField label={t('alternativeAddress')} name="alternative_address" value={form.alternative_address || ''} onChange={handleChange} disabled={!canEdit || !editing} />
      <TextField label={t('phone')} name="phone" value={form.phone || ''} onChange={handleChange} disabled={!canEdit || !editing} />
      <TextField
        label={t('dateOfBirth')}
        name="date_of_birth"
        type="date"
        value={form.date_of_birth || ''}
        onChange={handleChange}
        disabled={!canEdit || !editing}
        InputLabelProps={{ shrink: true }}
      />
      {canEdit && !editing && <Button onClick={() => setEditing(true)}>{t('edit')}</Button>}
      {canEdit && editing && <Button variant="contained" onClick={handleSave}>{t('save')}</Button>}
    </Box>
  );
}

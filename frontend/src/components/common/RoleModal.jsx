import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Reusable modal for adding/editing a user role.
 * @param {object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {function} props.onSubmit - Function to handle submit (receives { name })
 * @param {object} [props.initialValues] - Initial values for edit mode
 * @param {string} [props.mode] - 'add' or 'edit'
 */
export default function RoleModal({ open, onClose, onSubmit, initialValues = {}, mode = 'add' }) {
  const { t } = useTranslation();
  const [name, setName] = useState(initialValues.name || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setName(initialValues.name || '');
    setErrors({});
  }, [initialValues, open]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = t('roleNameRequired');
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit({ name: name.trim() });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{mode === 'edit' ? t('editRole') : t('addRole')}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('roleName')}
            fullWidth
            value={name}
            onChange={e => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('cancel')}</Button>
          <Button type="submit" variant="contained">{mode === 'edit' ? t('save') : t('add')}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

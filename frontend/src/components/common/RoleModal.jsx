import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Reusable modal for adding/editing a user role.
 * @param {object} props
 * @param {boolean} props.open - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {function} props.onSubmit - Function to handle submit (receives { role })
 * @param {object} [props.initialValues] - Initial values for edit mode
 * @param {string} [props.mode] - 'add' or 'edit'
 */
export default function RoleModal({ open, onClose, onSubmit, initialValues = {}, mode = 'add' }) {
  const { t } = useTranslation();
  const [role, setRole] = useState(initialValues.role || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setRole(initialValues.role || '');
    setErrors({});
  }, [initialValues, open]);

  const validate = () => {
    const errs = {};
    if (!role.trim()) errs.role = t('roleNameRequired');
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit({ role: role.trim() });
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
            value={role}
            onChange={e => setRole(e.target.value)}
            error={!!errors.role}
            helperText={errors.role}
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

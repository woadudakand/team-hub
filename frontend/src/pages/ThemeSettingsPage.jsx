import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateThemeSettings, setThemeModeDirection } from '../features/theme/themeSlice';
import { Box, Typography, TextField, Button, Switch, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DataService as axios } from '../utility/dataService';
import Loader from '../components/Loader';

export default function ThemeSettingsPage() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const settings = useSelector((state) => state.theme);
  const logoRef = useRef();
  const faviconRef = useRef();
  const [form, setForm] = React.useState(null);

  // Sync form with settings
  useEffect(() => {
    if (settings && settings.language) {
      setForm(settings);
    }
  }, [settings]);

  useEffect(() => {
    if (settings.language && !form?.language) {
      setForm((prev) => ({ ...prev, language: settings.language }));
    }
  }, [settings.language, form?.language]);

  useEffect(() => {
    if (form?.language) {
      i18n.changeLanguage(form.language);
    }
  }, [form?.language, i18n]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSwitch = (name) => (e) => {
    let newForm;
    if (name === 'mode') {
      newForm = { ...form, mode: e.target.checked ? 'dark' : 'light' };
      dispatch(setThemeModeDirection({ mode: newForm.mode }));
    } else if (name === 'direction') {
      newForm = { ...form, direction: e.target.checked ? 'rtl' : 'ltr' };
      dispatch(setThemeModeDirection({ direction: newForm.direction }));
    } else {
      newForm = { ...form, [name]: e.target.checked };
    }
    setForm(newForm);
    // Do NOT update backend here; only update Redux for live feedback
  };

  const handleFile = async (name, ref) => {
    const file = ref.current.files[0];
    if (file) {
      const formData = new FormData();
      formData.append(name, file);
      // Do NOT set Content-Type header manually!
      const res = await axios.post(import.meta.env.VITE_API_URL + '/theme-settings/upload', formData);
      setForm((prev) => ({ ...prev, [name]: res.data.url }));
    }
  };

  const handleUpdate = () => {
    dispatch(updateThemeSettings(form));
  };

  const languageValue = form?.language || settings.language || 'en';

  if (settings.loading || !form) {
    return <Loader message={t('loadingThemeSettings') || 'Loading...'} />;
  }

  return (
    <>
      <Box maxWidth={600} mx="auto" mt={4}>
        <Typography variant="h5" mb={2}>{t('themeSettings')}</Typography>
        <Box component="form" display="flex" flexDirection="column" gap={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box flex={1}><Typography>{t('uploadLogo')}</Typography></Box>
            <Box flex={2} display="flex" alignItems="center">
              <Button variant="contained" component="label">
                {t('uploadLogo')}
                <input type="file" hidden ref={logoRef} onChange={() => handleFile('logo', logoRef)} />
              </Button>
              {form?.logo && <img src={import.meta.env.VITE_API_URL + form.logo} alt={t('logo')} style={{ height: 40, marginLeft: 16 }} />}
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box flex={1}><Typography>{t('uploadFavicon')}</Typography></Box>
            <Box flex={2} display="flex" alignItems="center">
              <Button variant="contained" component="label">
                {t('uploadFavicon')}
                <input type="file" hidden ref={faviconRef} onChange={() => handleFile('favicon', faviconRef)} />
              </Button>
              {form?.favicon && <img src={import.meta.env.VITE_API_URL + form.favicon} alt={t('favicon')} style={{ height: 32, marginLeft: 16 }} />}
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box flex={1}><Typography>{t('title')}</Typography></Box>
            <Box flex={2}><TextField fullWidth name="title" value={form?.title} onChange={handleChange} label={t('title')} /></Box>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box flex={1}><Typography>{t('tagline')}</Typography></Box>
            <Box flex={2}><TextField fullWidth name="tagline" value={form?.tagline} onChange={handleChange} label={t('tagline')} /></Box>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box flex={1}><Typography>{t('language')}</Typography></Box>
            <Box flex={2}>
              <Select fullWidth sx={{ textAlign: 'left' }} value={languageValue} name="language" onChange={e => { i18n.changeLanguage(e.target.value); handleChange(e); }} label={t('language')}>
                {['en','bn','es','fr','de','hi','ar','ru','zh','pt'].map(l => (
                  <MenuItem key={l} value={l}>{t(l)}</MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box flex={1}><Typography>{t('darkMode')}</Typography></Box>
            <Box flex={2} display="flex" justifyContent="flex-start">
              <Switch checked={form?.mode === 'dark'} onChange={handleSwitch('mode')} />
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box flex={1}><Typography>{t('rtlMode')}</Typography></Box>
            <Box flex={2} display="flex" justifyContent="flex-start">
              <Switch checked={form?.direction === 'rtl'} onChange={handleSwitch('direction')} />
            </Box>
          </Box>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="primary" onClick={handleUpdate}>{t('update')}</Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

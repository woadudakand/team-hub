import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const initialState = {
  logo: '',
  favicon: '',
  title: '',
  tagline: '',
  language: 'en',
  mode: 'light',
  direction: 'ltr',
  loading: false,
  error: null,
};

export const fetchThemeSettings = createAsyncThunk('theme/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/theme-settings`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch');
  }
});

export const updateThemeSettings = createAsyncThunk('theme/update', async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/theme-settings`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to update');
  }
});

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeModeDirection: (state, action) => {
      if (action.payload.mode) state.mode = action.payload.mode;
      if (action.payload.direction) state.direction = action.payload.direction;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThemeSettings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchThemeSettings.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchThemeSettings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateThemeSettings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateThemeSettings.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(updateThemeSettings.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { setThemeModeDirection } = themeSlice.actions;

export default themeSlice.reducer;

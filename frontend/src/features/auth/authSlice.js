import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/login`, data);
      localStorage.setItem('token', res.data.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/register`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Signup failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/forgot-password`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Request failed');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/reset-password`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Reset failed');
    }
  }
);

export const signout = createAsyncThunk('auth/signout', async () => {
  localStorage.removeItem('token');
  return null;
});

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');
      const res = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to load user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;

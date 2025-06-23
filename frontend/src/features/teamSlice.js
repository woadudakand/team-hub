import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DataService as axios } from '../utility/dataService';

// Fetch paginated/searchable team list
export const fetchTeams = createAsyncThunk(
  'team/fetchTeams',
  async ({ search = '', limit = 10, offset = 0 } = {}) => {
    const { data } = await axios.get(`/team-list?search=${search}&limit=${limit}&offset=${offset}`);
    return data;
  }
);

// Fetch all teams (no pagination/search)
export const fetchAllTeams = createAsyncThunk(
  'team/fetchAllTeams',
  async () => {
    const { data } = await axios.get('/team');
    return data;
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    rows: [],
    total: 0,
    loading: false,
    error: null,
    search: '',
    page: 0,
    rowsPerPage: 10,
    allTeams: [],
  },
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 0;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
      state.page = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload.rows || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllTeams.fulfilled, (state, action) => {
        state.allTeams = action.payload || [];
      });
  },
});

export const { setSearch, setPage, setRowsPerPage } = teamSlice.actions;
export default teamSlice.reducer;

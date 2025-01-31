import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import IAccount from '../../types/IAccount';
import axiosInstance from '../../utils/axiosInstance';

interface AccountState {
  selectedAccount: IAccount | null;
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  selectedAccount: null,
  loading: false,
  error: null,
};

// Fetch a single account by id
export const fetchAccount = createAsyncThunk(
  'account/fetchAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/account`);
      return response.data;
    }
    catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Errore durante il recupero dell\'account');
    }
  }
);

// Update an existing account
export const updateAccount = createAsyncThunk(
  'account/updateAccount',
  async (newAccount: IAccount, { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/account`, newAccount);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Errore durante l\'aggiornamento dell\'account');
    }
  }
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //* Fetch a single account by id
      .addCase(fetchAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAccount = action.payload;
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.loading = false;
        state.selectedAccount = null;
        state.error = action.payload as string || 'Failed to fetch the account';
      })
      //* Update an existing account
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.loading = false;
        // state.selectedAccount = action.payload;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update account';
      });
  },
});

export default accountSlice.reducer;

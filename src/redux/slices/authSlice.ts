import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

interface AuthState {
  token: string | null;
  idAccount: number | null;
  idAnagrafica: number | null;
  email: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('CasaGialla_authToken') || null,
  idAccount: Number(localStorage.getItem('CasaGialla_idAccount')) || null,
  idAnagrafica: Number(localStorage.getItem('CasaGialla_idAnagrafica')) || null,
  email: localStorage.getItem('CasaGialla_email') || null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ Email, Password }: { Email: string; Password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', { Email, Password });
      localStorage.setItem('CasaGialla_authToken', response.data.accessToken); // Persist token
      localStorage.setItem('CasaGialla_idAccount', response.data.idAccount); // Persist idAccount
      localStorage.setItem('CasaGialla_idAnagrafica', response.data.idAnagrafica); // Persist idAnagrafica
      localStorage.setItem('CasaGialla_email', Email); // Persist email
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Errore di autenticazione');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/auth/logout'/* , {}, { withCredentials: true } */);
      localStorage.removeItem('CasaGialla_authToken');
      localStorage.removeItem('CasaGialla_idAccount');
      localStorage.removeItem('CasaGialla_idAnagrafica');
      localStorage.removeItem('CasaGialla_email');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Errore durante il logout');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Errore di invio richiesta reset password');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }: { token: string, newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Errore di reset password');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //* Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken;
        state.idAccount = action.payload.idAccount;
        state.idAnagrafica = action.payload.idAnagrafica;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.idAccount = null;
        state.idAnagrafica = null;
        state.error = action.payload as string;
      })
      //* Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.idAccount = null;
        state.idAnagrafica = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //* Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.idAccount = null;
        state.idAnagrafica = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //* Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.idAccount = null;
        state.idAnagrafica = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;

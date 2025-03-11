import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  idFamiglia: number | null;
  idAnagrafica: number | null;
  email: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('AgendaElettronica_authToken') || null,
  idFamiglia: 1,
  idAnagrafica: 1,
  email: localStorage.getItem('AgendaElettronica_email') || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ Email: string; Password: string }>) {
      state.email = action.payload.Email;
      state.token = action.payload.Password;
      localStorage.setItem('AgendaElettronica_authToken', state.token); // Persist token
      localStorage.setItem('AgendaElettronica_email', state.email); // Persist email
    },
    logout(state) {
      state.token = null;
      state.email = null;
      localStorage.removeItem('AgendaElettronica_authToken');
      localStorage.removeItem('AgendaElettronica_email');
    },
    forgotPassword(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    resetPassword(state, action: PayloadAction<{ token: string; Password: string }>) {
      state.token = action.payload.token;
      localStorage.setItem('AgendaElettronica_authToken', state.token); // Persist token
    }
  },
});

export const {
  login,
  logout,
  forgotPassword,
  resetPassword,
} = authSlice.actions;
export default authSlice.reducer;

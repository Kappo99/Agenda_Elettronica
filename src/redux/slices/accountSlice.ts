import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import IAccount, { exampleAccount } from '../../types/IAccount';
import axiosInstance from '../../utils/axiosInstance';
import { exampleAnagrafica } from '../../types/IAnagrafica';

interface AccountState {
  selectedAccount: IAccount | null;
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  selectedAccount: {
    ...exampleAccount,
    Id: 1,
    Id_Anagrafica: 1,
    Email: 'mail@kmsolution.it',
    Anagrafica: {
      ...exampleAnagrafica,
      Nome: 'KMsolution',
      Cognome: 'Srl',
      CF: 'KMSSRL80A01H501Z',
      DataNascita: '2022-06-30',
    }
  },
  loading: false,
  error: null,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    fetchAccount(state, action: PayloadAction<string | undefined>) {
      state.selectedAccount = initialState.selectedAccount;
    },
    updateAccount(state, action: PayloadAction<IAccount>) {
      state.selectedAccount = action.payload;
    },
  },
});
export const {
  fetchAccount,
  updateAccount,
} = accountSlice.actions;
export default accountSlice.reducer;

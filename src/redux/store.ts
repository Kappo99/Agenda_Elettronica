import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './slices/notificationSlice';
import popupReducer from './slices/popupSlice';
import authReducer from './slices/authSlice';
import famigliaReducer from './slices/famigliaSlice';
import anagraficaReducer from './slices/anagraficaSlice';
import agendaReducer from './slices/agendaSlice';
import documentoReducer from './slices/documentoSlice';
import accountReducer from './slices/accountSlice';

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    popup: popupReducer,
    auth: authReducer,
    famiglia: famigliaReducer,
    anagrafica: anagraficaReducer,
    documento: documentoReducer,
    agenda: agendaReducer,
    account: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

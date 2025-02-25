import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IGiornata, { exampleGiornata } from '../../types/IGiornata';
import { dateStr, todayStr } from '../../utils/functions';

interface GiornataState {
  agenda: IGiornata[];
  selectedGiornata: IGiornata | null;
  loadingGiornata: boolean;
  errorGiornata: string | null;
}

const initialState: GiornataState = {
  agenda: Array.from({ length: 20 }, (_, index) => ({
    ...exampleGiornata,
    Id: index + 1,
    Id_Anagrafica: index + 1,
    Data: dateStr(index + 1),
    FattiSignificativi: {
      ...exampleGiornata.FattiSignificativi,
      Mattina: `${index + 1}) Fatti successi al mattino`,
    }
  })),
  selectedGiornata: null,
  loadingGiornata: false,
  errorGiornata: null,
};

const agendaSlice = createSlice({
  name: 'agenda',
  initialState,
  reducers: {
    fetchAgenda(state, action: PayloadAction<{ id: number, searchTerm?: string }>) {
      state.agenda = initialState.agenda; // TODO: get just limited data paginated and searched from initialState.agenda
    },
    fetchGiornataByData(state, action: PayloadAction<{ id: number, date: string }>) {
      state.loadingGiornata = false;
      state.selectedGiornata = state.agenda.find((giornata) => giornata.Data === action.payload.date) || null;
    },
    createGiornata(state, action: PayloadAction<IGiornata>) {
      state.loadingGiornata = false;
      state.agenda.push(action.payload);
      state.selectedGiornata = action.payload;
    },
    deleteGiornata(state, action: PayloadAction<string>) {
      state.loadingGiornata = false;
      state.agenda = state.agenda.filter((giornata) => giornata.Data !== action.payload);
      state.selectedGiornata = null;
    },
  },
});

export const {
  fetchAgenda,
  fetchGiornataByData,
  createGiornata,
  deleteGiornata,
} = agendaSlice.actions;

export default agendaSlice.reducer;

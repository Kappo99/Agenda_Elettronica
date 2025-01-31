import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import IGiornata from '../../types/IGiornata';

interface GiornataState {
  agenda: IGiornata[];
  pages: number;
  selectedGiornata: IGiornata | null;
  loading: boolean;
  error: string | null;
}

const initialState: GiornataState = {
  agenda: [],
  pages: 0,
  selectedGiornata: null,
  loading: false,
  error: null,
};

// Fetch all agenda
export const fetchAgenda = createAsyncThunk(
  'agenda/fetchAgenda',
  async ({ id, page, limit, searchTerm }: { id: number, page: number, limit: number, searchTerm?: string }) => {
    const response = await axiosInstance.get(`/agenda/${id}${searchTerm ? `?s=${searchTerm}` : ''}`, {
      params: { page, limit },
    });
    return response.data;
  }
);

// Fetch a single giornata by data
export const fetchGiornataByData = createAsyncThunk(
  'agenda/fetchGiornataByData',
  async ({ id, date }: { id: number, date: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/agenda/${id}/${date}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Errore durante il recupero della giornata');
    }
  }
);

// Create a new giornata
export const createGiornata = createAsyncThunk(
  'agenda/createGiornata',
  async (newGiornata: IGiornata, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/agenda/${newGiornata.Id_Anagrafica}/${newGiornata.Data}`, newGiornata);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Errore durante la creazione della giornata');
    }
  }
);

// Delete an existing giornata
export const deleteGiornata = createAsyncThunk(
  'agenda/deleteGiornata',
  async ({ id, date }: { id: number, date: string }) => {
    const response = await axiosInstance.delete(`/agenda/${id}/${date}`);
    return { ...response.data, Data_Giornata: date };
  }
);

export const downloadPdfGiornata =
  async ({ id, date }: { id: number, date: string }) => {
    try {
      const response = await axiosInstance.get(`/agenda/${id}/${date}/download`, {
        responseType: 'blob', // Importante per ottenere il PDF come file binario
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? 'Errore durante il download del PDF');
    }
  };

export const downloadZipStorico =
  async ({ id, from, to }: { id: number, from: string, to: string }) => {
    try {
      const response = await axiosInstance.get(`/agenda/${id}/download`, {
        params: { from, to },
        responseType: 'blob', // Importante per ottenere il file ZIP come file binario
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? 'Errore durante il download del file ZIP');
    }
  };

const agendaSlice = createSlice({
  name: 'agenda',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all agenda
      .addCase(fetchAgenda.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgenda.fulfilled, (state, action) => {
        state.loading = false;
        state.agenda = action.payload.items;
        state.pages = action.payload.pages;
      })
      .addCase(fetchAgenda.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch agenda';
      })
      // Fetch a single giornata by data
      .addCase(fetchGiornataByData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGiornataByData.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGiornata = action.payload;
      })
      .addCase(fetchGiornataByData.rejected, (state, action) => {
        state.loading = false;
        state.selectedGiornata = null;
        state.error = action.payload as string || 'Failed to fetch the giornata';
      })
      //* Create a new giornata
      .addCase(createGiornata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGiornata.fulfilled, (state, action) => {
        state.loading = false;
        state.agenda.push(action.payload);
        state.selectedGiornata = action.payload;
      })
      .addCase(createGiornata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create giornata';
      })
      //* Delete an existing giornata
      .addCase(deleteGiornata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGiornata.fulfilled, (state, action) => {
        state.loading = false;
        state.agenda = state.agenda.filter((giornata) => giornata.Data !== action.payload.Data_Giornata);
        state.selectedGiornata = null;
      })
      .addCase(deleteGiornata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to delete giornata';
      });
  },
});

export default agendaSlice.reducer;

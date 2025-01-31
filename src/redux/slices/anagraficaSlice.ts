import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import IAnagrafica from '../../types/IAnagrafica';
import IDocumento from '../../types/IDocumento';
import axiosInstance from '../../utils/axiosInstance';

interface AnagraficaState {
  anagrafiche: IAnagrafica[];
  selectedAnagrafica: IAnagrafica | null;
  newAnagrafica: IAnagrafica | null
  loading: boolean;
  error: string | null;
}

const initialState: AnagraficaState = {
  anagrafiche: [],
  selectedAnagrafica: null,
  newAnagrafica: null,
  loading: false,
  error: null,
};

// Fetch all anagrafiche
export const fetchAnagrafiche = createAsyncThunk(
  'anagrafica/fetchAnagrafiche',
  async (searchTerm?: string) => {
    const response = await axiosInstance.get(`/anagrafica${searchTerm ? `?s=${searchTerm}` : ''}`);
    return response.data;
  }
);

// Fetch all anagrafiche archiviate
export const fetchAnagraficheArchived = createAsyncThunk(
  'anagrafica/fetchAnagraficheArchived',
  async (searchTerm?: string) => {
    const response = await axiosInstance.get(`/anagrafica/archivio${searchTerm ? `?s=${searchTerm}` : ''}`);
    return response.data;
  }
);

// Fetch a single anagrafica by id
export const fetchAnagraficaById = createAsyncThunk(
  'anagrafica/fetchAnagraficaById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/anagrafica/${id}`);
      return response.data;
    }
    catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Errore durante il recupero dell\'anagrafica');
    }
  }
);

// Create a new anagrafica
export const createAnagrafica = createAsyncThunk(
  'anagrafica/createAnagrafica',
  async (newAnagrafica: IAnagrafica, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/anagrafica', newAnagrafica);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Errore durante la creazione dell\'anagrafica');
    }
  }
);

// Update an existing anagrafica
export const updateAnagrafica = createAsyncThunk(
  'anagrafica/updateAnagrafica',
  async (
    { id, newAnagrafica }: { id: number, newAnagrafica: IAnagrafica },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(`/anagrafica/${id}`, newAnagrafica);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? 'Errore durante l\'aggiornamento dell\'anagrafica');
    }
  }
);

// Delete an existing anagrafica
export const deleteAnagrafica = createAsyncThunk(
  'anagrafica/deleteAnagrafica',
  async (id: number) => {
    const response = await axiosInstance.delete(`/anagrafica/${id}`);
    return response.data;
  }
);

// Archive an existing anagrafica
export const archiveAnagrafica = createAsyncThunk(
  'anagrafica/archiveAnagrafica',
  async (id: number) => {
    const response = await axiosInstance.put(`/anagrafica/${id}/archive`);
    return response.data;
  }
);

// Unarchive an existing anagrafica
export const unarchiveAnagrafica = createAsyncThunk(
  'anagrafica/unarchiveAnagrafica',
  async (id: number) => {
    const response = await axiosInstance.put(`/anagrafica/${id}/unarchive`);
    return response.data;
  }
);

// Azione per aggiornare la lista documenti nello stato di anagrafica
export const updateDocumentiList = createAsyncThunk(
  'anagrafica/updateDocumentiList',
  async ({ idAnagrafica, documento, remove = false }: { idAnagrafica: number; documento: IDocumento; remove?: boolean }) => {
    return { idAnagrafica, documento, remove };
  }
);

const anagraficaSlice = createSlice({
  name: 'anagrafica',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //* Fetch all anagrafiche
      .addCase(fetchAnagrafiche.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnagrafiche.fulfilled, (state, action) => {
        state.loading = false;
        state.anagrafiche = action.payload;
      })
      .addCase(fetchAnagrafiche.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch anagrafiche';
      })
      //* Fetch all anagrafiche archived
      .addCase(fetchAnagraficheArchived.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnagraficheArchived.fulfilled, (state, action) => {
        state.loading = false;
        state.anagrafiche = action.payload;
      })
      .addCase(fetchAnagraficheArchived.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch anagrafiche archived';
      })
      //* Fetch a single anagrafica by id
      .addCase(fetchAnagraficaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnagraficaById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAnagrafica = action.payload;
      })
      .addCase(fetchAnagraficaById.rejected, (state, action) => {
        state.loading = false;
        state.selectedAnagrafica = null;
        state.error = action.payload as string || 'Failed to fetch the anagrafica';
      })
      //* Create a new anagrafica
      .addCase(createAnagrafica.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAnagrafica.fulfilled, (state, action) => {
        state.loading = false;
        state.newAnagrafica = action.payload;
      })
      .addCase(createAnagrafica.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create anagrafica';
      })
      //* Update an existing anagrafica
      .addCase(updateAnagrafica.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAnagrafica.fulfilled, (state, action) => {
        state.loading = false;
        // state.selectedAnagrafica = action.payload;
      })
      .addCase(updateAnagrafica.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update anagrafica';
      })
      //* Delete an existing anagrafica
      .addCase(deleteAnagrafica.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnagrafica.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAnagrafica = null;
      })
      .addCase(deleteAnagrafica.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete anagrafica';
      })
      //* Archive an existing anagrafica
      .addCase(archiveAnagrafica.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(archiveAnagrafica.fulfilled, (state, action) => {
        state.loading = false;
        // state.selectedAnagrafica = action.payload;
      })
      .addCase(archiveAnagrafica.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to archive anagrafica';
      })
      //* Unarchive an existing anagrafica
      .addCase(unarchiveAnagrafica.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unarchiveAnagrafica.fulfilled, (state, action) => {
        state.loading = false;
        // state.selectedAnagrafica = action.payload;
      })
      .addCase(unarchiveAnagrafica.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to archive anagrafica';
      })
      //* Aggiorna lista documenti
      .addCase(updateDocumentiList.fulfilled, (state, action) => {
        const { idAnagrafica, documento, remove } = action.payload;
        if (state.selectedAnagrafica && state.selectedAnagrafica.Id === idAnagrafica) {
          if (remove) {
            state.selectedAnagrafica.Documenti = state.selectedAnagrafica.Documenti.filter(doc => doc.Id !== documento.Id);
          } else {
            state.selectedAnagrafica.Documenti.push(documento);
          }
        }
      });
  },
});

export default anagraficaSlice.reducer;

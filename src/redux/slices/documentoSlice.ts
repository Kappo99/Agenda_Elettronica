import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import IDocumento from '../../types/IDocumento';
import { updateDocumentiList } from './anagraficaSlice';

interface DocumentoState {
  documenti: IDocumento[];
  loading: boolean;
  error: string | null;
}

const initialState: DocumentoState = {
  documenti: [],
  loading: false,
  error: null,
};

export const uploadDocumento = createAsyncThunk(
  'documento/uploadDocumento',
  async (
    { idAnagrafica, name, file }: { idAnagrafica: number; name: string; file: File },
    { dispatch, rejectWithValue }
  ) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    try {
      const response = await axiosInstance.post(`/anagrafica/${idAnagrafica}/documento`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(updateDocumentiList({ idAnagrafica, documento: response.data }));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Errore durante il caricamento del documento');
    }
  }
);

export const deleteDocumento = createAsyncThunk(
  'documento/deleteDocumento',
  async (
    { idAnagrafica, documento }: { idAnagrafica: number; documento: IDocumento },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await axiosInstance.delete(`/anagrafica/${idAnagrafica}/documento/${documento.Id}`);
      dispatch(updateDocumentiList({ idAnagrafica, documento, remove: true }));
      return { documento };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Errore durante la rimozione del documento');
    }
  }
);

const documentoSlice = createSlice({
  name: 'documento',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //* Caricamento documento
      .addCase(uploadDocumento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocumento.fulfilled, (state, action) => {
        state.loading = false;
        state.documenti.push(action.payload);
      })
      .addCase(uploadDocumento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Errore durante il caricamento del documento';
      })
      //* Rimozione documento
      .addCase(deleteDocumento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDocumento.fulfilled, (state, action) => {
        state.loading = false;
        state.documenti = state.documenti.filter(doc => doc.Id !== action.payload.documento.Id);
      })
      .addCase(deleteDocumento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Errore durante la rimozione del documento';
      });
  },
});

export default documentoSlice.reducer;

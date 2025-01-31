import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IDocumento from "../../types/IDocumento";
import { updateDocumentiList } from "./anagraficaSlice";

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

const documentoSlice = createSlice({
  name: "documento",
  initialState,
  reducers: {
    uploadDocumento(
      state,
      action: PayloadAction<{ idAnagrafica: number; name: string }>
    ) {
      const newDocumento: IDocumento = {
        Id: state.documenti.length + 1,
        Id_Anagrafica: action.payload.idAnagrafica,
        Nome: action.payload.name,
        Path: `/documents/${action.payload.name}`,
        Creation: new Date().toISOString(),
        Timestamp: new Date().toISOString(),
      };
      state.documenti.push(newDocumento);
      updateDocumentiList({
        idAnagrafica: action.payload.idAnagrafica,
        documento: newDocumento,
      });
    },
    deleteDocumento(
      state,
      action: PayloadAction<{ idAnagrafica: number; documento: IDocumento }>
    ) {
      state.documenti = state.documenti.filter(
        (d) => d.Id !== action.payload.documento.Id
      );
      updateDocumentiList({
        idAnagrafica: action.payload.idAnagrafica,
        documento: action.payload.documento,
        remove: true,
      });
    },
  },
});

export const { uploadDocumento, deleteDocumento } = documentoSlice.actions;
export default documentoSlice.reducer;

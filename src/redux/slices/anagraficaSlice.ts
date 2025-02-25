import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IAnagrafica, { exampleAnagrafica } from "../../types/IAnagrafica";
import IDocumento from "../../types/IDocumento";
import { UserSex } from "../../types";
import { search } from "../../utils/functions";

interface AnagraficaState {
  anagrafiche: IAnagrafica[];
  selectedAnagrafica: IAnagrafica | null;
  loadingAnagrafica: boolean;
  errorAnagrafica: string | null;
}

const initialState: AnagraficaState = {
  anagrafiche: [
    {
      ...exampleAnagrafica,
      Id: 1,
      Nome: "Mario",
      Cognome: "Rossi",
      CF: "RSSMRA80A01H501Z",
      DataNascita: "1980-01-01",
      Sesso: UserSex.MALE,
      IsEducatore: false,
    },
    {
      ...exampleAnagrafica,
      Id: 2,
      Nome: "Anna",
      Cognome: "Verdi",
      CF: "VRDNNA85B02F205Y",
      DataNascita: "1985-02-02",
      Sesso: UserSex.FEMALE,
      IsEducatore: true,
    },
  ],
  selectedAnagrafica: null,
  loadingAnagrafica: false,
  errorAnagrafica: null,
};

const anagraficaSlice = createSlice({
  name: "anagrafica",
  initialState,
  reducers: {
    fetchAnagrafiche(state, action: PayloadAction<string | undefined>) {
      state.anagrafiche = initialState.anagrafiche.filter((a) => !a.IsArchiviato);
      state.anagrafiche = search(state.anagrafiche, action.payload ?? "");
    },
    fetchAnagraficheArchived(state, action: PayloadAction<string | undefined>) {
      state.anagrafiche = initialState.anagrafiche.filter((a) => a.IsArchiviato);
      state.anagrafiche = search(state.anagrafiche, action.payload ?? "");
    },
    fetchAnagraficaById(state, action: PayloadAction<number>) {
      state.selectedAnagrafica =
        state.anagrafiche.find((a) => a.Id === action.payload) || null;
    },
    createAnagrafica(state, action: PayloadAction<IAnagrafica>) {
      state.anagrafiche.push({
        ...action.payload,
        Id: state.anagrafiche.length + 1,
      });
    },
    updateAnagrafica(
      state,
      action: PayloadAction<{ id: number; newAnagrafica: IAnagrafica }>
    ) {
      const index = state.anagrafiche.findIndex(
        (a) => a.Id === action.payload.id
      );
      if (index !== -1) {
        state.anagrafiche[index] = action.payload.newAnagrafica;
      }
    },
    deleteAnagrafica(state, action: PayloadAction<number>) {
      state.anagrafiche = state.anagrafiche.filter(
        (a) => a.Id !== action.payload
      );
    },
    archiveAnagrafica(state, action: PayloadAction<number>) {
      const index = state.anagrafiche.findIndex((a) => a.Id === action.payload);
      if (index !== -1) {
        state.anagrafiche[index].IsArchiviato = true;
      }
    },
    unarchiveAnagrafica(state, action: PayloadAction<number>) {
      const index = state.anagrafiche.findIndex((a) => a.Id === action.payload);
      if (index !== -1) {
        state.anagrafiche[index].IsArchiviato = false;
      }
    },
    updateDocumentiList(
      state,
      action: PayloadAction<{
        idAnagrafica: number;
        documento: IDocumento;
        remove?: boolean;
      }>
    ) {
      const index = state.anagrafiche.findIndex(
        (a) => a.Id === action.payload.idAnagrafica
      );
      if (index !== -1) {
        if (action.payload.remove) {
          state.anagrafiche[index].Documenti = state.anagrafiche[
            index
          ].Documenti.filter((doc) => doc.Id !== action.payload.documento.Id);
        } else {
          state.anagrafiche[index].Documenti.push(action.payload.documento);
        }
      }
    },
  },
});

export const {
  fetchAnagrafiche,
  fetchAnagraficheArchived,
  fetchAnagraficaById,
  createAnagrafica,
  updateAnagrafica,
  deleteAnagrafica,
  archiveAnagrafica,
  unarchiveAnagrafica,
  updateDocumentiList,
} = anagraficaSlice.actions;
export default anagraficaSlice.reducer;

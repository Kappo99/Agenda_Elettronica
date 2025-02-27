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
      Nome: "KMsolution",
      Cognome: "Fornitore",
      CF: "KMSSRL80A01H501Z",
      DataNascita: "2022-06-30",
      Residenza: "Busto Arsizio",
      Sesso: UserSex.MALE,
      IsEducatore: true,
      IsArchiviato: true,
    },
    {
      ...exampleAnagrafica,
      Id: 2,
      Nome: "Mario",
      Cognome: "Rossi",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2009-01-01",
      Sesso: UserSex.MALE,
      IsEducatore: false,
    },
    {
      ...exampleAnagrafica,
      Id: 3,
      Nome: "Anna",
      Cognome: "Verdi",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2021-08-22",
      Sesso: UserSex.FEMALE,
      IsEducatore: false,
    },
    {
      ...exampleAnagrafica,
      Id: 4,
      Nome: "Francesco Luigi",
      Cognome: "Bianchi",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2020-07-16",
      Sesso: UserSex.MALE,
      IsEducatore: false,
    },

    {
      ...exampleAnagrafica,
      Id: 5,
      Nome: "Giorgia",
      Cognome: "Rosa",
      CF: "CFCFCF00C00F000C",
      DataNascita: "1999-03-04",
      Sesso: UserSex.FEMALE,
      IsEducatore: true,
    },

    {
      ...exampleAnagrafica,
      Id: 6,
      Nome: "Sogia",
      Cognome: "Neri",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2008-12-23",
      Sesso: UserSex.FEMALE,
      IsEducatore: false,
      IsArchiviato: true,
    },
    {
      ...exampleAnagrafica,
      Id: 7,
      Nome: "Luca",
      Cognome: "Archivio",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2006-04-18",
      Sesso: UserSex.MALE,
      IsEducatore: false,
      IsArchiviato: true,
    },
    {
      ...exampleAnagrafica,
      Id: 8,
      Nome: "Alessandro",
      Cognome: "Bianchi",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2015-05-26",
      Sesso: UserSex.MALE,
      IsEducatore: false,
    },
    {
      ...exampleAnagrafica,
      Id: 9,
      Nome: "Martina",
      Cognome: "Conti",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2000-12-09",
      Sesso: UserSex.FEMALE,
      IsEducatore: false,
      IsArchiviato: true,
    },
    {
      ...exampleAnagrafica,
      Id: 10,
      Nome: "Elena",
      Cognome: "Ferri",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2016-01-23",
      Sesso: UserSex.FEMALE,
      IsEducatore: false,
    },
    {
      ...exampleAnagrafica,
      Id: 11,
      Nome: "Andrea",
      Cognome: "Galli",
      CF: "CFCFCF00C00F000C",
      DataNascita: "1986-07-04",
      Sesso: UserSex.MALE,
      IsEducatore: true,
    },
    {
      ...exampleAnagrafica,
      Id: 12,
      Nome: "Sara",
      Cognome: "Gentili",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2004-02-10",
      Sesso: UserSex.FEMALE,
      IsEducatore: false,
      IsArchiviato: true,
    },
    {
      ...exampleAnagrafica,
      Id: 13,
      Nome: "Davide",
      Cognome: "Romano",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2009-11-03",
      Sesso: UserSex.MALE,
      IsEducatore: false,
    },
    {
      ...exampleAnagrafica,
      Id: 14,
      Nome: "Francesca Maria",
      Cognome: "Fontana",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2020-04-12",
      Sesso: UserSex.FEMALE,
      IsEducatore: false,
    },
    {
      ...exampleAnagrafica,
      Id: 15,
      Nome: "Riccardo",
      Cognome: "Gentili",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2018-09-23",
      Sesso: UserSex.MALE,
      IsEducatore: false,
    },
    {
      ...exampleAnagrafica,
      Id: 16,
      Nome: "Elena",
      Cognome: "Moretti",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2019-04-01",
      Sesso: UserSex.FEMALE,
      IsEducatore: false,
    },
    {
      ...exampleAnagrafica,
      Id: 17,
      Nome: "Luna",
      Cognome: "Pellegri",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2001-11-04",
      Sesso: UserSex.FEMALE,
      IsEducatore: true,
    },
    {
      ...exampleAnagrafica,
      Id: 18,
      Nome: "Martina",
      Cognome: "Benedetti",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2019-05-19",
      Sesso: UserSex.FEMALE,
      IsEducatore: false,
      IsArchiviato: true,
    },
    {
      ...exampleAnagrafica,
      Id: 19,
      Nome: "Matteo",
      Cognome: "Antonelli",
      CF: "CFCFCF00C00F000C",
      DataNascita: "1998-02-19",
      Sesso: UserSex.MALE,
      IsEducatore: true,
      IsArchiviato: true,
    },
    {
      ...exampleAnagrafica,
      Id: 20,
      Nome: "Chiara",
      Cognome: "Bianchetti",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2017-03-20",
      Sesso: UserSex.FEMALE,
      IsEducatore: false,
    },
    {
      ...exampleAnagrafica,
      Id: 21,
      Nome: "Giovanni",
      Cognome: "Ferrari",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2013-08-12",
      Sesso: UserSex.MALE,
    },
    {
      ...exampleAnagrafica,
      Id: 22,
      Nome: "Alessia",
      Cognome: "Bianchi",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2011-12-06",
      Sesso: UserSex.FEMALE,
    },
    {
      ...exampleAnagrafica,
      Id: 23,
      Nome: "Giuseppe",
      Cognome: "Verdi",
      CF: "CFCFCF00C00F000C",
      DataNascita: "2015-03-18",
      Sesso: UserSex.MALE,
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
      state.anagrafiche = initialState.anagrafiche.filter(
        (a) => !a.IsArchiviato
      );
      state.anagrafiche = search(state.anagrafiche, action.payload ?? "");
    },
    fetchAnagraficheArchived(state, action: PayloadAction<string | undefined>) {
      state.anagrafiche = initialState.anagrafiche.filter(
        (a) => a.IsArchiviato
      );
      state.anagrafiche = search(state.anagrafiche, action.payload ?? "");
    },
    fetchAnagraficaById(state, action: PayloadAction<number>) {
      state.selectedAnagrafica =
        initialState.anagrafiche.find((a) => a.Id === action.payload) || null;
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
      const index = initialState.anagrafiche.findIndex(
        (a) => a.Id === action.payload.id
      );
      if (index !== -1) {
        state.anagrafiche[index] = action.payload.newAnagrafica;
      }
    },
    deleteAnagrafica(state, action: PayloadAction<number>) {
      state.anagrafiche = initialState.anagrafiche.filter(
        (a) => a.Id !== action.payload
      );
    },
    archiveAnagrafica(state, action: PayloadAction<number>) {
      const index = initialState.anagrafiche.findIndex(
        (a) => a.Id === action.payload
      );
      if (index !== -1) {
        state.anagrafiche[index].IsArchiviato = true;
      }
    },
    unarchiveAnagrafica(state, action: PayloadAction<number>) {
      const index = initialState.anagrafiche.findIndex(
        (a) => a.Id === action.payload
      );
      console.log(index);
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

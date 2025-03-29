import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IFamiglia, { exampleFamiglia } from "../../types/IFamiglia";
import IDocumento from "../../types/IDocumento";
import { Role, UserSex } from "../../types";
import { search } from "../../utils/functions";
import { exampleAnagrafica } from "../../types/IAnagrafica";

interface FamigliaState {
  famiglie: IFamiglia[];
  selectedFamiglia: IFamiglia | null;
  loadingFamiglia: boolean;
  errorFamiglia: string | null;
}

const initialState: FamigliaState = {
  famiglie: [
    {
      ...exampleFamiglia,
      Id: 1,
      Cognome: "Account Demo",
      IsArchiviato: true,
      Anagrafiche: [
        {
          ...exampleAnagrafica,
          Nome: "KMsolution",
          Cognome: "Fornitore",
          CF: "KMSSRL80A01H501Z",
          DataNascita: "2022-06-30",
          Residenza: "Busto Arsizio",
          Sesso: UserSex.MALE,
          IsEducatore: true,
          Ruolo: Role.GENITORE,
        },
      ],
    },
    {
      ...exampleFamiglia,
      Id: 2,
      Cognome: "Educatori",
      Anagrafiche: [
        {
          ...exampleAnagrafica,
          Nome: "Giorgia",
          Cognome: "Rosa",
          CF: "CFCFCF00C00F000C",
          DataNascita: "1999-03-04",
          Sesso: UserSex.FEMALE,
          IsEducatore: true,
          Ruolo: Role.GENITORE,
        },
        {
          ...exampleAnagrafica,
          Nome: "Andrea",
          Cognome: "Galli",
          CF: "CFCFCF00C00F000C",
          DataNascita: "1986-07-04",
          Sesso: UserSex.MALE,
          IsEducatore: true,
          Ruolo: Role.GENITORE,
        },
        {
          ...exampleAnagrafica,
          Nome: "Luna",
          Cognome: "Pellegri",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2001-11-04",
          Sesso: UserSex.FEMALE,
          IsEducatore: true,
          Ruolo: Role.GENITORE,
        },
        {
          ...exampleAnagrafica,
          Nome: "Matteo",
          Cognome: "Antonelli",
          CF: "CFCFCF00C00F000C",
          DataNascita: "1998-02-19",
          Sesso: UserSex.MALE,
          IsEducatore: true,
          Ruolo: Role.GENITORE,
        },
      ],
    },
    {
      ...exampleFamiglia,
      Id: 3,
      Cognome: "Famiglia demo 1",
      Anagrafiche: [
        {
          ...exampleAnagrafica,
          Nome: "Mario",
          Cognome: "Rossi",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2009-01-01",
          Sesso: UserSex.MALE,
          IsEducatore: false,
          Ruolo: Role.GENITORE,
        },
        {
          ...exampleAnagrafica,
          Nome: "Anna",
          Cognome: "Verdi",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2021-08-22",
          Sesso: UserSex.FEMALE,
          IsEducatore: false,
          Ruolo: Role.GENITORE,
        },
        {
          ...exampleAnagrafica,
          Nome: "Francesco Luigi",
          Cognome: "Bianchi",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2020-07-16",
          Sesso: UserSex.MALE,
          IsEducatore: false,
          Ruolo: Role.FIGLIO,
        },
      ],
    },
    {
      ...exampleFamiglia,
      Id: 4,
      Cognome: "Famiglia demo 2",
      Anagrafiche: [
        {
          ...exampleAnagrafica,
          Nome: "Sofia",
          Cognome: "Neri",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2008-12-23",
          Sesso: UserSex.FEMALE,
          IsEducatore: false,
          IsArchiviato: true,
          Ruolo: Role.GENITORE,
        },
        {
          ...exampleAnagrafica,
          Nome: "Luca",
          Cognome: "Archivio",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2006-04-18",
          Sesso: UserSex.MALE,
          IsEducatore: false,
          IsArchiviato: true,
          Ruolo: Role.GENITORE,
        },
        {
          ...exampleAnagrafica,
          Nome: "Alessandro",
          Cognome: "Bianchi",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2015-05-26",
          Sesso: UserSex.MALE,
          IsEducatore: false,
          Ruolo: Role.FIGLIO,
        },
        {
          ...exampleAnagrafica,
          Nome: "Martina",
          Cognome: "Conti",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2000-12-09",
          Sesso: UserSex.FEMALE,
          IsEducatore: false,
          IsArchiviato: true,
          Ruolo: Role.FIGLIO,
        },
        {
          ...exampleAnagrafica,
          Nome: "Elena",
          Cognome: "Ferri",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2016-01-23",
          Sesso: UserSex.FEMALE,
          IsEducatore: false,
          Ruolo: Role.FIGLIO,
        },
      ],
    },
    {
      ...exampleFamiglia,
      Id: 5,
      Cognome: "Famiglia demo 3",
      Anagrafiche: [
        {
          ...exampleAnagrafica,
          Nome: "Francesca Maria",
          Cognome: "Fontana",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2020-04-12",
          Sesso: UserSex.FEMALE,
          IsEducatore: false,
          Ruolo: Role.GENITORE,
        },
        {
          ...exampleAnagrafica,
          Nome: "Riccardo",
          Cognome: "Gentili",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2018-09-23",
          Sesso: UserSex.MALE,
          IsEducatore: false,
          Ruolo: Role.GENITORE,
        },
        {
          ...exampleAnagrafica,
          Nome: "Elena",
          Cognome: "Moretti",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2019-04-01",
          Sesso: UserSex.FEMALE,
          IsEducatore: false,
          Ruolo: Role.FIGLIO,
        },
      ],
    },
    {
      ...exampleFamiglia,
      Id: 6,
      Cognome: "Famiglia demo 4",
      Anagrafiche: [
        {
          ...exampleAnagrafica,
          Nome: "Sara",
          Cognome: "Gentili",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2004-02-10",
          Sesso: UserSex.FEMALE,
          IsEducatore: false,
          IsArchiviato: true,
          Ruolo: Role.GENITORE,
        },
        {
          ...exampleAnagrafica,
          Nome: "Davide",
          Cognome: "Romano",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2009-11-03",
          Sesso: UserSex.MALE,
          IsEducatore: false,
          Ruolo: Role.FIGLIO,
        },
      ],
    },
    {
      ...exampleFamiglia,
      Id: 7,
      Cognome: "Famiglia demo 5",
      Anagrafiche: [
        {
          ...exampleAnagrafica,
          Nome: "Martina",
          Cognome: "Benedetti",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2019-05-19",
          Sesso: UserSex.FEMALE,
          IsEducatore: false,
          IsArchiviato: true,
          Ruolo: Role.GENITORE,
        },
        {
          ...exampleAnagrafica,
          Nome: "Chiara",
          Cognome: "Bianchetti",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2017-03-20",
          Sesso: UserSex.FEMALE,
          IsEducatore: false,
          Ruolo: Role.FIGLIO,
        },
        {
          ...exampleAnagrafica,
          Nome: "Giovanni",
          Cognome: "Ferrari",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2013-08-12",
          Sesso: UserSex.MALE,
          Ruolo: Role.FIGLIO,
        },
        {
          ...exampleAnagrafica,
          Nome: "Alessia",
          Cognome: "Bianchi",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2011-12-06",
          Sesso: UserSex.FEMALE,
          Ruolo: Role.FIGLIO,
        },
        {
          ...exampleAnagrafica,
          Nome: "Giuseppe",
          Cognome: "Verdi",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2015-03-18",
          Sesso: UserSex.MALE,
          Ruolo: Role.FIGLIO,
        },
      ],
    },
    {
      ...exampleFamiglia,
      Id: 8,
      Cognome: "Famiglia archivio 1",
      IsArchiviato: true,
      Anagrafiche: [
        {
          ...exampleAnagrafica,
          Nome: "Sofia",
          Cognome: "Neri",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2008-12-23",
          Sesso: UserSex.FEMALE,
          IsEducatore: false,
          IsArchiviato: true,
          Ruolo: Role.GENITORE,
        },
        {
          ...exampleAnagrafica,
          Nome: "Luca",
          Cognome: "Archivio",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2006-04-18",
          Sesso: UserSex.MALE,
          IsEducatore: false,
          IsArchiviato: true,
          Ruolo: Role.GENITORE,
        },
        {
          ...exampleAnagrafica,
          Nome: "Martina",
          Cognome: "Conti",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2000-12-09",
          Sesso: UserSex.FEMALE,
          IsEducatore: false,
          IsArchiviato: true,
          Ruolo: Role.FIGLIO,
        },
      ],
    },
    {
      ...exampleFamiglia,
      Id: 9,
      Cognome: "Famiglia archivio 2",
      IsArchiviato: true,
      Anagrafiche: [
        {
          ...exampleAnagrafica,
          Nome: "Sara",
          Cognome: "Gentili",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2004-02-10",
          Sesso: UserSex.FEMALE,
          IsEducatore: false,
          IsArchiviato: true,
          Ruolo: Role.GENITORE,
        },
        {
          ...exampleAnagrafica,
          Nome: "Martina",
          Cognome: "Benedetti",
          CF: "CFCFCF00C00F000C",
          DataNascita: "2019-05-19",
          Sesso: UserSex.FEMALE,
          IsEducatore: false,
          IsArchiviato: true,
          Ruolo: Role.GENITORE,
        },
      ],
    },
  ],
  selectedFamiglia: null,
  loadingFamiglia: false,
  errorFamiglia: null,
};

const famigliaSlice = createSlice({
  name: "famiglia",
  initialState,
  reducers: {
    fetchFamiglie(state, action: PayloadAction<string | undefined>) {
      state.famiglie = initialState.famiglie.filter(
        (a) => !a.IsArchiviato
      );
      state.famiglie = search(state.famiglie, action.payload ?? "");
    },
    fetchFamiglieArchived(state, action: PayloadAction<string | undefined>) {
      state.famiglie = initialState.famiglie.filter(
        (a) => a.IsArchiviato
      );
      state.famiglie = search(state.famiglie, action.payload ?? "");
    },
    fetchFamigliaById(state, action: PayloadAction<number>) {
      state.selectedFamiglia =
        initialState.famiglie.find((a) => a.Id === action.payload) || null;
    },
    createFamiglia(state, action: PayloadAction<IFamiglia>) {
      state.famiglie.push({
        ...action.payload,
        Id: state.famiglie.length + 1,
      });
    },
    updateFamiglia(
      state,
      action: PayloadAction<{ id: number; newFamiglia: IFamiglia }>
    ) {
      const index = initialState.famiglie.findIndex(
        (a) => a.Id === action.payload.id
      );
      if (index !== -1) {
        state.famiglie[index] = action.payload.newFamiglia;
      }
    },
    deleteFamiglia(state, action: PayloadAction<number>) {
      state.famiglie = initialState.famiglie.filter(
        (a) => a.Id !== action.payload
      );
    },
    archiveFamiglia(state, action: PayloadAction<number>) {
      const index = initialState.famiglie.findIndex(
        (a) => a.Id === action.payload
      );
      if (index !== -1) {
        state.famiglie[index].IsArchiviato = true;
      }
    },
    unarchiveFamiglia(state, action: PayloadAction<number>) {
      const index = initialState.famiglie.findIndex(
        (a) => a.Id === action.payload
      );
      console.log(index);
      if (index !== -1) {
        state.famiglie[index].IsArchiviato = false;
      }
    },
  },
});

export const {
  fetchFamiglie,
  fetchFamiglieArchived,
  fetchFamigliaById,
  createFamiglia,
  updateFamiglia,
  deleteFamiglia,
  archiveFamiglia,
  unarchiveFamiglia,
} = famigliaSlice.actions;
export default famigliaSlice.reducer;

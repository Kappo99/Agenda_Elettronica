import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IGiornata, { exampleGiornata } from '../../types/IGiornata';
import { dateStr, search } from '../../utils/functions';
import { UscitaType } from '../../types';
import { exampleUscita } from '../../types/IUscita';
import { examplePasto } from '../../types/IPasto';
import { exampleSonno } from '../../types/ISonno';
import { exampleIgiene } from '../../types/IIgiene';
import { exampleFattoSignificativo } from '../../types/IFattoSignificativo';
import { examplePisolino } from '../../types/IPisolino';
import { exampleTerapia } from '../../types/ITerapia';

interface GiornataState {
  agenda: IGiornata[];
  selectedGiornata: IGiornata | null;
  loadingGiornata: boolean;
  errorGiornata: string | null;
}

const initialState: GiornataState = {
  agenda: [
    {
      ...exampleGiornata,
      Id: 1,
      Data: dateStr(1),
      Sonno: {
        ...exampleSonno,
        Sveglia: '08:30',
        Note: 'Riposo tranquillo',
      },
      Pasti: {
        ...examplePasto,
        Colazione: '09:00',
        NoteColazione: 'Latte e cereali',
        Pranzo: '12:00',
        NotePranzo: 'Pasta al sugo',
        Cena: '19:00',
        NoteCena: 'Bastoncini di pesce',
        MerendaPomeriggio: '15:00',
        NoteMerendaPomeriggio: 'Panino con Nutella',
      },
      Uscite: [
        {
          ...exampleUscita,
          Tipologia: UscitaType.ORDINARIA,
          Motivo: 'Parco giochi',
        },
      ],
      Igiene: {
        ...exampleIgiene,
        Bagno: '18:00',
        NoteBagno: 'Piedi e sedere',
      },
      FattiSignificativi: {
        ...exampleFattoSignificativo,
        Mattina: 'Risveglio tranquillo',
      },
    },
    {
      ...exampleGiornata,
      Id: 2,
      Data: dateStr(2),
      Sonno: {
        ...exampleSonno,
        Sveglia: '07:30',
        Letto: '21:00',
      },
      Pasti: {
        ...examplePasto,
        Colazione: '08:00',
        NoteColazione: 'Pane e Nutella',
        Pranzo: '12:30',
        NotePranzo: 'Carne',
        Cena: '19:15',
        NoteCena: 'Pasta',
        MerendaMattino: '11:00',
        NoteMerendaMattino: 'Kinder fetta al latte',
        MerendaPomeriggio: '15:30',
        NoteMerendaPomeriggio: 'Patatine',
      },
      Igiene: {
        ...exampleIgiene,
        Bagno: '18:15',
        NoteBagno: 'Completo',
      },
      FattiSignificativi: {
        ...exampleFattoSignificativo,
        Pomeriggio: 'Gioca con voglia',
      },
    },
    {
      ...exampleGiornata,
      Id: 3,
      Data: dateStr(3),
      Sonno: {
        ...exampleSonno,
        Sveglia: '09:15',
        Letto: '22:30',
        Note: "Difficoltà nell'addormentarsi",
      },
      Pasti: {
        ...examplePasto,
        Pranzo: '13:00',
        NotePranzo: 'Riso',
        Cena: '20:30',
        NoteCena: 'Pasta',
        MerendaMattino: '11:10',
        NoteMerendaMattino: 'Brioches Kinder',
        MerendaPomeriggio: '15:15',
        NoteMerendaPomeriggio: 'Patatine e succo',
      },
      Igiene: {
        ...exampleIgiene,
        Bagno: '18:30',
        NoteBagno: 'Completo',
      },
    },
    {
      ...exampleGiornata,
      Id: 4,
      Data: dateStr(4),
      Sonno: {
        ...exampleSonno,
        Sveglia: '08:00',
        Letto: '21:15',
      },
      Pasti: {
        ...examplePasto,
        Colazione: '08:15',
        NoteColazione: 'Latte e cereali',
        Pranzo: '12:45',
        NotePranzo: 'Pasta al sugo',
        Cena: '18:30',
        NoteCena: 'Affettati e pane',
        MerendaPomeriggio: '16:00',
        NoteMerendaPomeriggio: 'Torta',
      },
      Igiene: {
        ...exampleIgiene,
        Bagno: '17:30',
        NoteBagno: 'Piedi e sedere',
      },
      FattiSignificativi: {
        ...exampleFattoSignificativo,
        Sera: 'Fatica ad addormentarsi',
        IsPreferito: true,
      },
    },
    {
      ...exampleGiornata,
      Id: 5,
      Data: dateStr(5),
      Sonno: {
        ...exampleSonno,
        Sveglia: '08:15',
        Letto: '21:30',
      },
      Pasti: {
        ...examplePasto,
        Colazione: '08:30',
        NoteColazione: 'Pane e Nutella',
        Pranzo: '12:00',
        NotePranzo: 'Pasta al sugo',
        Cena: '19:15',
        NoteCena: 'Spiedini',
      },
      Uscite: [
        {
          ...exampleUscita,
          Tipologia: UscitaType.EXTRA,
          Motivo: 'Parco avventura',
          Data: dateStr(5),
          Ora: '10:00',
          Responsabile: 'Rosa Giorgia',
          DataRientro: dateStr(5),
          OraRientro: '19:00',
          ResponsabileRientro: 'Rosa Giorgia',
        },
      ],
      FattiSignificativi: {
        ...exampleFattoSignificativo,
        Mattina: 'Risveglio tranquillo',
      },
    },
    {
      ...exampleGiornata,
      Id: 6,
      Data: dateStr(6),
      Sonno: {
        ...exampleSonno,
        Sveglia: '08:45',
        Letto: '21:00',
        Pisolini: [
          {
            ...examplePisolino,
            Letto: '15:00',
            Sveglia: '16:00',
          },
        ],
      },
      Pasti: {
        ...examplePasto,
        Colazione: '09:00',
        NoteColazione: 'Latte e cereali',
        Pranzo: '11:00',
        NotePranzo: 'Carne',
        Cena: '19:30',
        NoteCena: 'Pasta',
      },
      Igiene: {
        ...exampleIgiene,
        Bagno: '18:30',
        NoteBagno: 'Completo',
      },
      FattiSignificativi: {
        ...exampleFattoSignificativo,
        Pomeriggio: 'Gioca con voglia',
      },
    },
    {
      ...exampleGiornata,
      Id: 7,
      Data: dateStr(7),
      Sonno: {
        ...exampleSonno,
        Sveglia: '09:00',
        Letto: '19:45',
      },
      Pasti: {
        ...examplePasto,
        Colazione: '09:15',
        NoteColazione: 'Latte e biscotti',
        Pranzo: '12:00',
        NotePranzo: 'Riso',
        Cena: '18:30',
        NoteCena: 'Bastoncini di pesce',
      },
      Igiene: {
        ...exampleIgiene,
        Bagno: '18:30',
        NoteBagno: 'Completo',
      },
      FattiSignificativi: {
        ...exampleFattoSignificativo,
        Mattina: 'Risveglio tranquillo',
      },
    },
    {
      ...exampleGiornata,
      Id: 8,
      Data: dateStr(8),
      Sonno: {
        ...exampleSonno,
        Sveglia: '09:150',
        Letto: '20:30',
      },
      Pasti: {
        ...examplePasto,
        Colazione: '09:45',
        NoteColazione: 'Pane e Nutella',
        Pranzo: '12:30',
        NotePranzo: 'Pasta al sugo',
        Cena: '19:15',
        NoteCena: 'Pizza',
      },
      Igiene: {
        ...exampleIgiene,
        Bagno: '18:30',
        NoteBagno: 'Completo',
        Cambio: '16:00',
        NoteCambio: 'Maglietta',
      },
      FattiSignificativi: {
        ...exampleFattoSignificativo,
        Sera: 'Fatica ad addormentarsi',
        IsPreferito: true,
      },
    },
    {
      ...exampleGiornata,
      Id: 9,
      Data: dateStr(9),
      Sonno: {
        ...exampleSonno,
        Sveglia: '09:15',
        Letto: '21:00',
      },
      Pasti: {
        ...examplePasto,
        Colazione: '10:00',
        NoteColazione: 'Latte e cereali',
        Pranzo: '13:00',
        NotePranzo: 'Riso',
        Cena: '20:00',
        NoteCena: 'Bastoncini di pesce',
        MerendaMattino: '10:45',
        NoteMerendaMattino: 'Kinder fetta al latte',
      },
      Uscite: [
        {
          ...exampleUscita,
          Tipologia: UscitaType.ORDINARIA,
          Motivo: 'Parco giochi',
          Data: dateStr(9),
          Ora: '09:45',
          Responsabile: 'Rosa Giorgia',
          DataRientro: dateStr(9),
          OraRientro: '19:00',
          ResponsabileRientro: 'Rosa Giorgia',
        },
      ],
      FattiSignificativi: {
        ...exampleFattoSignificativo,
        Pomeriggio: 'Gioca con voglia',
      },
    },
    {
      ...exampleGiornata,
      Id: 10,
      Data: dateStr(10),
      Sonno: {
        ...exampleSonno,
        Sveglia: '10:00',
        Letto: '20:45',
        Pisolini: [
          {
            ...examplePisolino,
            Letto: '15:00',
            Sveglia: '16:00',
          },
        ],
      },
      Pasti: {
        ...examplePasto,
        Pranzo: '13:00',
        NotePranzo: 'Pasta al sugo',
        Cena: '19:45',
        NoteCena: 'Pizza',
        MerendaMattino: '11:00',
        NoteMerendaMattino: 'Brioches Kinder',
      },
      Igiene: {
        ...exampleIgiene,
        Bagno: '18:00',
        NoteBagno: 'Piedi e sedere',
      },
      Terapie: [
        {
          ...exampleTerapia,
          Tipologia: 'Tachipirina',
          Inizio: '10:00',
          Termine: '10:15',
        },
      ],
      FattiSignificativi: {
        ...exampleFattoSignificativo,
        Sera: 'Fatica ad addormentarsi',
      },
    },
    {
      ...exampleGiornata,
      Id: 11,
      Data: dateStr(11),
      Sonno: {
        ...exampleSonno,
        Sveglia: '08:45',
        Letto: '20:45',
      },
      Pasti: {
        ...examplePasto,
        Colazione: '09:00',
        NoteColazione: 'Latte e cereali',
        Pranzo: '11:00',
        NotePranzo: 'Pasta al sugo',
        Cena: '18:30',
        NoteCena: 'Pizza',
        MerendaPomeriggio: '16:00',
        NoteMerendaPomeriggio: 'Torta',
      },
      Igiene: {
        ...exampleIgiene,
        Bagno: '18:15',
        NoteBagno: 'Completo',
      },
    },
    {
      ...exampleGiornata,
      Id: 12,
      Data: dateStr(12),
      Sonno: {
        ...exampleSonno,
        Sveglia: '07:45',
        Letto: '19:45',
      },
      Pasti: {
        ...examplePasto,
        Colazione: '08:15',
        NoteColazione: 'Latte e cereali',
        Pranzo: '11:30',
        NotePranzo: 'Riso',
        Cena: '19:15',
        NoteCena: 'Bastoncini di pesce',
        MerendaPomeriggio: '16:00',
        NoteMerendaPomeriggio: 'Patatine',
      },
      Uscite: [
        {
          ...exampleUscita,
          Tipologia: UscitaType.ORDINARIA,
          Motivo: 'Parco giochi',
          Data: dateStr(12),
          Ora: '10:30',
          Responsabile: 'Luna Pellegri',
          DataRientro: dateStr(12),
          OraRientro: '19:00',
          ResponsabileRientro: 'Rosa Giorgia',
        },
      ],
      Igiene: {
        ...exampleIgiene,
        Bagno: '18:30',
        NoteBagno: 'Completo',
      },
      FattiSignificativi: {
        ...exampleFattoSignificativo,
        Mattina: 'Risveglio tranquillo',
        Pomeriggio: 'Gioca con voglia',
      },
    },
    {
      ...exampleGiornata,
      Id: 13,
      Data: dateStr(13),
      Sonno: {
        ...exampleSonno,
        Sveglia: '08:15',
        Letto: '20:30',
        Pisolini: [
          {
            ...examplePisolino,
            Letto: '15:00',
            Sveglia: '16:00',
          },
        ],
      },
      Pasti: {
        ...examplePasto,
        Colazione: '09:00',
        NoteColazione: 'Pane e Nutella',
        Pranzo: '12:00',
        NotePranzo: 'Riso',
        Cena: '19:00',
        NoteCena: 'Pasta',
        MerendaPomeriggio: '15:15',
        NoteMerendaPomeriggio: 'Patatine e succo',
      },
      Igiene: {
        ...exampleIgiene,
        Bagno: '17:30',
        NoteBagno: 'Piedi e sedere',
      },
    },
    {
      ...exampleGiornata,
      Id: 14,
      Data: dateStr(14),
      Sonno: {
        ...exampleSonno,
        Sveglia: '08:45',
        Letto: '21:00',
      },
      Pasti: {
        ...examplePasto,
        Colazione: '09:00',
        NoteColazione: 'Latte e cereali',
        Pranzo: '12:30',
        NotePranzo: 'Carne',
        Cena: '18:45',
        NoteCena: 'Pasta',
        MerendaPomeriggio: '15:15',
        NoteMerendaPomeriggio: 'Torta',
      },
      FattiSignificativi: {
        ...exampleFattoSignificativo,
        Pomeriggio: 'Gioca con voglia',
      },
    },
    {
      ...exampleGiornata,
      Id: 15,
      Data: dateStr(15),
      Sonno: {
        ...exampleSonno,
        Sveglia: '07:45',
        Letto: '20:45',
      },
      Pasti: {
        ...examplePasto,
        Colazione: '08:15',
        NoteColazione: 'Latte e cereali',
        Pranzo: '13:00',
        NotePranzo: 'Carne',
        Cena: '20:00',
        NoteCena: 'Pizza',
        MerendaMattino: '11:15',
        NoteMerendaMattino: 'Kinder fetta al latte',
      },
      Igiene: {
        ...exampleIgiene,
        Cambio: '16:00',
        NoteCambio: 'Maglietta',
      },
    },
    {
      ...exampleGiornata,
      Id: 16,
      Data: dateStr(16),
      Sonno: {
        ...exampleSonno,
        Sveglia: '08:45',
        Letto: '20:30',
        Pisolini: [
          {
            ...examplePisolino,
            Letto: '15:00',
            Sveglia: '16:00',
          },
        ],
      },
      Pasti: {
        ...examplePasto,
        Colazione: '09:00',
        NoteColazione: 'Latte e cereali',
        Pranzo: '11:30',
        NotePranzo: 'Riso',
        Cena: '18:30',
        NoteCena: 'Pasta',
        MerendaMattino: '10:45',
        NoteMerendaMattino: 'Brioches Kinder',
        MerendaPomeriggio: '15:00',
        NoteMerendaPomeriggio: 'Panino con Nutella',
      },
      Uscite: [
        {
          ...exampleUscita,
          Tipologia: UscitaType.ORDINARIA,
          Motivo: 'Parco giochi',
          Data: dateStr(16),
          Ora: '10:45',
          Responsabile: 'Rosa Giorgia',
          DataRientro: dateStr(16),
          OraRientro: '19:00',
          ResponsabileRientro: 'Luna Pellegri',
        },
      ],
      Igiene: {
        ...exampleIgiene,
        Bagno: '18:00',
        NoteBagno: 'Piedi e sedere',
      },
      FattiSignificativi: {
        ...exampleFattoSignificativo,
        Sera: 'Fatica ad addormentarsi',
      },
    },
    {
      ...exampleGiornata,
      Id: 17,
      Data: dateStr(17),
      Sonno: {
        ...exampleSonno,
        Sveglia: '07:45',
        Letto: '19:45',
      },
      Pasti: {
        ...examplePasto,
        Colazione: '08:00',
        NoteColazione: 'Pane e Nutella',
        Pranzo: '12:00',
        NotePranzo: 'Riso',
        Cena: '19:15',
        NoteCena: 'Bastoncini di pesce',
        MerendaPomeriggio: '15:30',
        NoteMerendaPomeriggio: 'Patatine e succo',
      },
      Igiene: {
        ...exampleIgiene,
        Bagno: '18:15',
        NoteBagno: 'Completo',
      },
      Terapie: [
        {
          ...exampleTerapia,
          Tipologia: 'Tachipirina',
          Inizio: '10:00',
          Termine: '10:15',
        },
      ],
      FattiSignificativi: {
        ...exampleFattoSignificativo,
        Mattina: 'Risveglio tranquillo',
        Pomeriggio: 'Gioca con voglia',
        IsPreferito: true,
      },
    },
    {
      ...exampleGiornata,
      Id: 18,
      Data: dateStr(18),
      Sonno: {
        ...exampleSonno,
        Sveglia: '08:15',
        Letto: '20:30',
        Pisolini: [
          {
            ...examplePisolino,
            Letto: '14:45',
            Sveglia: '16:30',
          },
        ],
      },
      Pasti: {
        ...examplePasto,
        Colazione: '08:30',
        NoteColazione: 'Latte e biscotti',
        Pranzo: '12:30',
        NotePranzo: 'Carne',
        Cena: '18:30',
        NoteCena: 'Pizza',
        MerendaPomeriggio: '15:15',
        NoteMerendaPomeriggio: 'Patatine e succo',
      },
      Igiene: {
        ...exampleIgiene,
        Bagno: '18:30',
        NoteBagno: 'Completo',
      },
      FattiSignificativi: {
        ...exampleFattoSignificativo,
        Mattina: 'Risveglio tranquillo',
      },
    },
    {
      ...exampleGiornata,
      Id: 19,
      Data: dateStr(19),
      Sonno: {
        ...exampleSonno,
        Sveglia: '08:45',
        Letto: '21:00',
      },
      Pasti: {
        ...examplePasto,
        Colazione: '09:00',
        NoteColazione: 'Latte e cereali',
        Pranzo: '13:00',
        NotePranzo: 'Carne',
        Cena: '19:15',
        NoteCena: 'Bastoncini di pesce',
        MerendaMattino: '11:00',
        NoteMerendaMattino: 'Kinder fetta al latte',
        MerendaPomeriggio: '16:00',
        NoteMerendaPomeriggio: 'Torta',
      },
      Uscite: [
        {
          ...exampleUscita,
          Tipologia: UscitaType.EXTRA,
          Motivo: 'Parco avventura',
          Data: dateStr(19),
          Ora: '10:00',
          Responsabile: 'Rosa Giorgia',
          DataRientro: dateStr(19),
          OraRientro: '19:00',
          ResponsabileRientro: 'Rosa Giorgia',
        },
      ],
      Igiene: {
        ...exampleIgiene,
        Bagno: '17:30',
        NoteBagno: 'Piedi e sedere',
      },
    },
    {
      ...exampleGiornata,
      Id: 20,
      Data: dateStr(20),
      Sonno: {
        ...exampleSonno,
        Sveglia: '07:45',
        Letto: '20:45',
        Pisolini: [
          {
            ...examplePisolino,
            Letto: '15:00',
            Sveglia: '16:00',
          },
        ],
      },
      Pasti: {
        ...examplePasto,
        Colazione: '00:00',
        NoteColazione: 'Latte e cereali',
        Pranzo: '12:30',
        NotePranzo: 'Riso',
        Cena: '19:45',
        NoteCena: 'Bastoncini di pesce',
        MerendaMattino: '11:00',
        NoteMerendaMattino: 'Briches Kinder',
      },
    },
  ],
  selectedGiornata: null,
  loadingGiornata: false,
  errorGiornata: null,
};

const agendaSlice = createSlice({
  name: 'agenda',
  initialState,
  reducers: {
    fetchAgenda(state, action: PayloadAction<boolean | undefined>) {
      state.agenda = initialState.agenda;
      if (action.payload)
        state.agenda = state.agenda.filter((giornata) => giornata.FattiSignificativi.IsPreferito);
      // state.agenda = search(state.agenda, action.payload ?? "");
    },
    fetchGiornataByData(state, action: PayloadAction<string>) {
      state.loadingGiornata = false;
      state.selectedGiornata = state.agenda.find((giornata) => giornata.Data === action.payload) || null;
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

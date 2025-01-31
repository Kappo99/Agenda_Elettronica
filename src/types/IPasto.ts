export default interface IPasto {
    Id: number;
    Id_Giornata: number;
    Colazione: string | null;
    NoteColazione: string | null;
    Pranzo: string | null;
    NotePranzo: string | null;
    Cena: string | null;
    NoteCena: string | null;
    MerendaMattino: string | null;
    NoteMerendaMattino: string | null;
    MerendaPomeriggio: string | null;
    NoteMerendaPomeriggio: string | null;
    Creation: string;
    Timestamp: string;
}

export const examplePasto: IPasto = {
    Id: 0,
    Id_Giornata: 0,
    Colazione: null,
    NoteColazione: null,
    Pranzo: null,
    NotePranzo: null,
    Cena: null,
    NoteCena: null,
    MerendaMattino: null,
    NoteMerendaMattino: null,
    MerendaPomeriggio: null,
    NoteMerendaPomeriggio: null,
    Creation: '',
    Timestamp: '',
}

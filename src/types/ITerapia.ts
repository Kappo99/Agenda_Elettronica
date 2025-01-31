export default interface ITerapia {
    Id: number;
    Id_Giornata: number;
    Tipologia: string | null;
    Inizio: string | null;
    Termine: string | null;
    Note: string | null;
    Creation: string;
    Timestamp: string;
}

export const exampleTerapia: ITerapia = {
    Id: 0,
    Id_Giornata: 0,
    Tipologia: null,
    Inizio: null,
    Termine: null,
    Note: null,
    Creation: '',
    Timestamp: '',
};

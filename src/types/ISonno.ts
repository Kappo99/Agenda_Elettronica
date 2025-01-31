import IPisolino from "./IPisolino";

export default interface ISonno {
    Id: number;
    Id_Giornata: number;
    Sveglia: string | null;
    Letto: string | null;
    Note: string | null;
    Creation: string;
    Timestamp: string;

    //* NotMapped
    Pisolini: IPisolino[] | null;
}

export const exampleSonno: ISonno = {
    Id: 0,
    Id_Giornata: 0,
    Sveglia: null,
    Letto: null,
    Note: null,
    Creation: '',
    Timestamp: '',
    Pisolini: null,
}

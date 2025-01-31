export default interface IPisolino {
    Id: number;
    Id_Sonno: number;
    Letto: string | null;
    Sveglia: string | null;
    Note: string | null;
    Creation: string;
    Timestamp: string;
}

export const examplePisolino: IPisolino = {
    Id: 0,
    Id_Sonno: 0,
    Letto: null,
    Sveglia: null,
    Note: null,
    Creation: '',
    Timestamp: '',
};

export default interface IIgiene {
    Id: number;
    Id_Giornata: number;
    Bagno: string | null;
    NoteBagno: string | null;
    Cambio: string | null;
    NoteCambio: string | null;
    Creation: string;
    Timestamp: string;
}

export const exampleIgiene: IIgiene = {
    Id: 0,
    Id_Giornata: 0,
    Bagno: null,
    NoteBagno: null,
    Cambio: null,
    NoteCambio: null,
    Creation: '',
    Timestamp: '',
}

import { UscitaType } from ".";

export default interface IUscita {
    Id: number;
    Id_Giornata: number;
    Tipologia: UscitaType | null;
    Motivo: string | null;
    Data: string | null;
    Ora: string | null;
    Responsabile: string | null;
    DataRientro: string | null;
    OraRientro: string | null;
    ResponsabileRientro: string | null;
    Creation: string;
    Timestamp: string;
}

export const exampleUscita: IUscita = {
    Id: 0,
    Id_Giornata: 0,
    Tipologia: null,
    Motivo: null,
    Data: null,
    Ora: null,
    Responsabile: null,
    DataRientro: null,
    OraRientro: null,
    ResponsabileRientro: null,
    Creation: '',
    Timestamp: '',
}

import IFattoSignificativo, { exampleFattoSignificativo } from "./IFattoSignificativo";
import IIgiene, { exampleIgiene } from "./IIgiene";
import IPasto, { examplePasto } from "./IPasto";
import ISonno, { exampleSonno } from "./ISonno";
import ITerapia from "./ITerapia";
import IUscita, { exampleUscita } from "./IUscita";

export default interface IGiornata {
    Id: number;
    Id_Anagrafica: number;
    Data: string;
    Creation: string;
    Timestamp: string;

    //* NotMapped
    Sonno: ISonno;
    Pasti: IPasto;
    Uscite: IUscita[];
    Igiene: IIgiene;
    Terapie: ITerapia[];
    FattiSignificativi: IFattoSignificativo;
}

export const exampleGiornata: IGiornata = {
    Id: 0,
    Id_Anagrafica: 0,
    Data: '',
    Creation: '',
    Timestamp: '',

    Sonno: exampleSonno,
    Pasti: examplePasto,
    Uscite: [],
    Igiene: exampleIgiene,
    Terapie: [],
    FattiSignificativi: exampleFattoSignificativo,
};

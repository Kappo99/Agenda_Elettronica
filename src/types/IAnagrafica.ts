import { UserSex } from ".";
import IDocumento from "./IDocumento";

export default interface IAnagrafica {
    Id: number;
    Nome: string;
    Cognome: string;
    DataNascita: string;
    CF: string;
    Sesso: UserSex;
    Residenza: string;
    Ingresso: string | null;
    IsArchiviato: boolean;
    Creation: string;
    Timestamp: string;

    //* NotMapped
    IsEducatore: boolean;
    Documenti: IDocumento[];
}

export const exampleAnagrafica: IAnagrafica = {
    Id: 0,
    Nome: '',
    Cognome: '',
    DataNascita: '',
    CF: '',
    Sesso: UserSex.NONE,
    Residenza: '',
    Ingresso: null,
    IsArchiviato: false,
    Creation: '',
    Timestamp: '',

    //* NotMapped
    IsEducatore: false,
    Documenti: [],
};
import { Role, UserSex } from ".";
import IDocumento from "./IDocumento";

export default interface IAnagrafica {
    Id: number;
    Id_Famiglia: number;
    Nome: string;
    Cognome: string;
    DataNascita: string;
    CF: string;
    Sesso: UserSex;
    Residenza: string | null;
    Ingresso: string | null;
    Ruolo: Role;
    IsArchiviato: boolean;
    Creation: string;
    Timestamp: string;

    //* NotMapped
    IsEducatore: boolean;
    Documenti: IDocumento[];
}

export const exampleAnagrafica: IAnagrafica = {
    Id: 0,
    Id_Famiglia: 0,
    Nome: '',
    Cognome: '',
    DataNascita: '',
    CF: '',
    Sesso: UserSex.NONE,
    Residenza: null,
    Ingresso: null,
    Ruolo: Role.GENITORE,
    IsArchiviato: false,
    Creation: '',
    Timestamp: '',

    //* NotMapped
    IsEducatore: false,
    Documenti: [],
};
import IAnagrafica from "./IAnagrafica";

export default interface IFamiglia {
    Id: number;
    Cognome: string;
    IsArchiviato: boolean;
    Creation: string;
    Timestamp: string;

    //* NotMapped
    Anagrafiche: IAnagrafica[];
}

export const exampleFamiglia: IFamiglia = {
    Id: 0,
    Cognome: '',
    IsArchiviato: false,
    Creation: '',
    Timestamp: '',

    //* NotMapped
    Anagrafiche: [],
};
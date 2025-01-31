import IAnagrafica, { exampleAnagrafica } from "./IAnagrafica";

export default interface IAccount {
    Id: number;
    Id_Anagrafica: number;
    Email: string;
    Password: string;
    Creation: string;
    Timestamp: string;

    //* NotMapped
    Anagrafica: IAnagrafica;
    NewPassword: string;
    NewPasswordConfirm: string;
}

export const exampleAccount: IAccount = {
    Id: 0,
    Id_Anagrafica: 0,
    Email: '',
    Password: '',
    Creation: '',
    Timestamp: '',

    Anagrafica: exampleAnagrafica,
    NewPassword: '',
    NewPasswordConfirm: '',
};

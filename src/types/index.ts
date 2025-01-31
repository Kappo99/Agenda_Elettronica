export enum PageType {
    ALL = 'ALL',
    SINGLE = 'SINGLE',
    CREATE = 'CREATE',
    EDIT = 'EDIT',
}
export type PageTypeForm = PageType.CREATE | PageType.EDIT | PageType.SINGLE;

export enum UserSex {
    NONE = '',
    MALE = 'M',
    FEMALE = 'F',
}

export enum MessageType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
}

export enum PasswordType {
    OLD = 'old',
    NEW = 'new',
    CONFIRM = 'confirm',
}

export enum UscitaType {
    ORDINARIA = 'Ordinaria',
    EXTRA = 'Extra',
}

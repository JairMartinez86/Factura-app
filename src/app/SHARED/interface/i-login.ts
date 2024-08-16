import { iToken } from "./i-Token";

export interface iLogin{
    User: string;
    Nombre : string;
    Pwd : string;
    Rol: string;
    Bodega : string;
    Lotificar : boolean;
    FechaLogin: string;
    Desconecion : boolean;
    ColaImpresionWeb : boolean;
    FechaServer : string;
    TimeOut: number;
    Token : iToken;
}
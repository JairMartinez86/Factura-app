export interface iEstadoCuenta{
    FechaDoc: Date;
    NoDocOrigen : string;
    AplicadoA : string;
    Concepto : string;
    Debe: number,
    Haber : number;
    Saldo : number;
    Acumulado : number;
    Corriente : number;
    Vencido : number;
    De1a30Dias : number;
    De31a60Dias : number;
    De61a90Dias : number;
    De91a120Dias : number;
    De121aMasDias : number;
    DiasV : number;
    IdMoneda : string;
    Expandir : boolean;
}
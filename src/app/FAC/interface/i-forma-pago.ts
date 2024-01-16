export interface iFormaPago{
    Index : number;
    IdRecDetPago : number;
    IdRecibo : number;
    IdPago : any;
    IdFormaPago : any;
    NoDoc : String;
    Fecha : String;
    Referencia : String;
    IdBanco : any;
    IdMoneda : String;
    Importe : any;
    ImporteDolar : number;
    ImporteCordoba : number;
    EsTransaccion : boolean;
    EsRetencion : boolean;
    strEvento : String;
    }
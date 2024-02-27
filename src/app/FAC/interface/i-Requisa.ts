import { iRequisaDet } from "./i-Requisa-Det";

export interface iRequisa{
    IdRequisa: any;
    NoRequisa : string;
    CodBodega : string;
    CodBodegaDestino : string;
    Fecha: Date;
    RequisaDetalle : iRequisaDet[];
}
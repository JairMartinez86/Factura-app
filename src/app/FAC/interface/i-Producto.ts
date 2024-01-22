export interface iProducto{
    IdProducto:number;
    Codigo: string;
    Producto: string;
    IdImpuesto : any;
    ConImpuesto : boolean;
    IdUnidad :  number;
    Filtro: string;
    Key: string;
    Bonificable: boolean;
    Servicios : boolean;
    FacturaNegativo : boolean;
}
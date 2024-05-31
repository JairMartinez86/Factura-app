export interface iProducto{
    IdProducto:number;
    Codigo: string;
    Producto: string;
    IdImpuesto : any;
    ConImpuesto : boolean;
    IdUnidad :  number;
    NoParte : string;
    Proveedor : string;
    Filtro: string;
    Key: string;
    Bonificable: boolean;
    Servicios : boolean;
    FacturaNegativo : boolean;
    IdGrupoPresupuestario: number;
    IdGrupo: number;
    IdSubGrupo: number;
    CodProveedorEscasan : string;
}
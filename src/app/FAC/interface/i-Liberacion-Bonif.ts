export interface iLiberacionBonif{
    IdLiberarBonificacion: number;
    IdBodega : number;
    Bodega : string;
    IdProducto : number;
    CodProducto : string;
    Producto : string;
    IdCliente : number;
    Cliente : string;
    CantMax : number;
    Facturada : number;
    FechaAsignacion:Date;
    Activo: boolean;
    Usuario :string;
}

export interface iLiberacionPrecio{
    IdLiberarPrecio: number;
    IdBodega : number;
    Bodega : string;
    IdProducto : number;
    CodProducto : string;
    Producto : string;
    IdCliente : number;
    Cliente : string;
    Motivo: string;
    PrecioP : number;
    PrecioD : number;
    FechaAsignacion:Date;
    Activo: boolean;
    Usuario :string;
}

import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";

@Injectable({
    providedIn: 'root',
  })
export class getFactura{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

    public DatosSucursal(CodBodega : string, TipoFactura : string) : Observable<string>{
      return this.http.get<any>(this._Cnx.Url() + "Factura/DatosSucursal?CodBodega=" + CodBodega + "&TipoFactura=" + TipoFactura);
   }
    
    public Datos_Factura(user : string) : Observable<string>{
       return this.http.get<any>(this._Cnx.Url() + "Factura/Datos?user=" + user);
    }
    
    public Datos_Credito(CodCliente : string) : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Factura/DatosCredito?CodCliente=" + CodCliente);
     }

     public Datos_ClienteClave(CodCliente : string) : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Factura/ClienteClave?CodCliente=" + CodCliente);
     }
     



     public Cargar_Productos(CodBodega : string) : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Factura/CargarProductos?CodBodega=" + CodBodega);
     }


     public Datos_Producto(CodProducto : string, CodBodega : string, CodCliente : string, user : string) : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Factura/DatosProducto?CodProducto=" + CodProducto + "&CodBodega=" + CodBodega + "&CodCliente=" + CodCliente + "&user=" + user);
     }
     
     public BonificacionLibre(CodCliente : string, CodBodega : string) : Observable<string>{
      return this.http.get<any>(this._Cnx.Url() + "Factura/BonificacionLibre?&CodCliente=" + CodCliente + "&CodBodega=" + CodBodega);
   }
     
     public Direcciones(CodCliente : string) : Observable<string>{
      return this.http.get<any>(this._Cnx.Url() + "Factura/Direcciones?CodCliente=" + CodCliente);
   }
   


   public Productos_Liberados_Web_INESCASAN(CodCliente : string, CodBodega : String) : Observable<string>{
      return this.http.get<any>(this._Cnx.Url() + "Factura/ProductoLiberadosInvEscasan?CodCliente=" + CodCliente + "&CodBodega=" + CodBodega);
   }

    
   public Get(Fecha1 :Date, Fecha2 : Date, Tipo : string, EsCola : boolean) : Observable<string>{
      return this.http.get<any>(this._Cnx.Url() + "Factura/Get?Fecha1=" + Fecha1 + "&Fecha2=" + Fecha2 + "&Tipo=" + Tipo + "&EsCola=" + EsCola);
   }
   

   public GetDetalle(IdVenta : string, User : string) : Observable<string>{
      return this.http.get<any>(this._Cnx.Url() + "Factura/GetDetalle?IdVenta=" + IdVenta +  "&User=" + User);
   }


   public Imprimir(IdVenta : string, ImprimirProforma : boolean, enviarCorreo: boolean) : Observable<string>{
      return this.http.get<any>(this._Cnx.Url() + "Factura/Imprimir?IdVenta=" + IdVenta + "&ImprimirProforma=" + ImprimirProforma + "&enviarCorreo=" + enviarCorreo);
   }
   
   public ImprimirA4(IdVenta : string) : Observable<string>{
      return this.http.get<any>(this._Cnx.Url() + "Factura/ImprimirA4?IdVenta=" + IdVenta);
   }
   

   public GetExistenciaUbicacion(CodProducto : string, CodBodega : string) : Observable<string>{
      return this.http.get<any>(this._Cnx.Url() +  "Factura/GetExistenciaUbicacion?CodProducto=" + CodProducto +"&CodBodega=" +CodBodega);
   }


   public GetFormaPago() : Observable<string>{
      return this.http.get<any>(this._Cnx.Url() + "Factura/GetFormaPago");
   }

}
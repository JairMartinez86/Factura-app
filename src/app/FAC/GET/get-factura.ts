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

      
      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };



      return this.http.get<any>(this._Cnx.Url() + "Factura/DatosSucursal?CodBodega=" + CodBodega + "&TipoFactura=" + TipoFactura + "&refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
   }
    
    public Datos_Factura(user : string) : Observable<string>{

      
      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };


       return this.http.get<any>(this._Cnx.Url() + "Factura/Datos?user=" + user + "&refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
    }
    
    public Datos_Credito(CodCliente : string) : Observable<string>{

      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };


        return this.http.get<any>(this._Cnx.Url() + "Factura/DatosCredito?CodCliente=" + CodCliente + "&refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
     }

     public Datos_ClienteClave(CodCliente : string) : Observable<string>{

      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };

        return this.http.get<any>(this._Cnx.Url() + "Factura/ClienteClave?CodCliente=" + CodCliente + "&refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
     }
     



     public Cargar_Productos(CodBodega : string) : Observable<string>{

      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };
       
        return this.http.get<any>(this._Cnx.Url() + "Factura/CargarProductos?CodBodega=" + CodBodega + "&refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
     }


     public Datos_Producto(CodProducto : string, CodBodega : string, CodCliente : string, user : string) : Observable<string>{

      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };

        return this.http.get<any>(this._Cnx.Url() + "Factura/DatosProducto?CodProducto=" + CodProducto + "&CodBodega=" + CodBodega + "&CodCliente=" + CodCliente + "&user=" + user + "&refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
     }
     
     public BonificacionLibre(CodCliente : string, CodBodega : string) : Observable<string>{

      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };


      return this.http.get<any>(this._Cnx.Url() + "Factura/BonificacionLibre?&CodCliente=" + CodCliente + "&CodBodega=" + CodBodega+ "&refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
   }
     
     public Direcciones(CodCliente : string) : Observable<string>{
      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };

      return this.http.get<any>(this._Cnx.Url() + "Factura/Direcciones?CodCliente=" + CodCliente + "&refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
   }
   


   public Productos_Liberados_Web_INESCASAN(CodCliente : string, CodBodega : String) : Observable<string>{
      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };

      return this.http.get<any>(this._Cnx.Url() + "Factura/ProductoLiberadosInvEscasan?CodCliente=" + CodCliente + "&CodBodega=" + CodBodega + "&refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
   }

    
   public Get(Fecha1 :string, Fecha2 : string, Tipo : string, EsCola : boolean, ProformaVencida : boolean, usuario : string) : Observable<string>{
      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };

      return this.http.get<any>(this._Cnx.Url() + "Factura/Get?Fecha1=" + Fecha1 + "&Fecha2=" + Fecha2 + "&Tipo=" + Tipo + "&EsCola=" + EsCola + "&ProformaVencida=" + ProformaVencida + "&usuario=" + usuario + "&refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
   }
   

   public GetDetalle(IdVenta : string, User : string) : Observable<string>{
      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };

      return this.http.get<any>(this._Cnx.Url() + "Factura/GetDetalle?IdVenta=" + IdVenta +  "&User=" + User + "&refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
   }


   public Imprimir(IdVenta : string, ImprimirProforma : boolean, enviarCorreo: boolean) : Observable<string>{
      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };

      return this.http.get<any>(this._Cnx.Url() + "Factura/Imprimir?IdVenta=" + IdVenta + "&ImprimirProforma=" + ImprimirProforma + "&enviarCorreo=" + enviarCorreo + "&refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
   }
   
   public ImprimirA4(IdVenta : string) : Observable<string>{
      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };
      return this.http.get<any>(this._Cnx.Url() + "Factura/ImprimirA4?IdVenta=" + IdVenta + "&refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
   }
   

   public GetExistenciaUbicacion(CodProducto : string, CodBodega : string) : Observable<string>{
      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };
      return this.http.get<any>(this._Cnx.Url() +  "Factura/GetExistenciaUbicacion?CodProducto=" + CodProducto +"&CodBodega=" +CodBodega + "&refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
   }


   public GetFormaPago() : Observable<string>{
      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };
      return this.http.get<any>(this._Cnx.Url() + "Factura/GetFormaPago?refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
   }


   public GetDatosLiberacionPrecio() : Observable<string>{

      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };

      return this.http.get<any>(this._Cnx.Url() + "Factura/GetDatosLiberacionPrecio?refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
   }

   public GetDatosLiberacionBonif() : Observable<string>{

      var options = {
         'headers': {
           'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
           'content-type': 'application/json'
         }
       };
       
      return this.http.get<any>(this._Cnx.Url() + "Factura/GetDatosLiberacionBonif?refresh_token=" + localStorage.getItem("FAC_refresh_token"), options );
   }

}
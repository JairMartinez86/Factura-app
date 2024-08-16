import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iFactPed } from "../interface/i-Factura-Pedido";
import { iFacturaPagoCancelacion } from "../interface/i-Factura-Pago-Cancelacion";
import { iLiberarExixtencia } from "../interface/i-Liberar-Existencia";
import { iLiberacionPrecio } from "../interface/i-Liberacion-Precio";
import { iLiberacionBonif } from "../interface/i-Liberacion-Bonif";
import { iData } from "src/app/SIS/Interface/Data";

@Injectable({
    providedIn: 'root',
  })
export class postFactura{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

    GuardarFactura(d : iFactPed) : Observable<string> { 


        var options = {
            'headers': {
              'Authorization': 'Bearer ' + localStorage.getItem("token"),
              'content-type': 'application/json'
            }
          };

          
        let data : iData = {} as iData;
        data.d = d;
        data.refresh_token = localStorage.getItem("refresh_token");


        
        return this.http.post<any>(this._Cnx.Url() + "Factura/Guardar", JSON.stringify(data), options);

    }

    AnularFactura(IdDoc : string, Motivo: string, Usuario: string) : Observable<string> { 

        
        var options = {
            'headers': {
              'Authorization': 'Bearer ' + localStorage.getItem("token"),
              'content-type': 'application/json'
            }
          };

          


        return this.http.post<any>(this._Cnx.Url() + "Factura/Anular?IdDoc=" + IdDoc + "&Motivo=" + Motivo + "&Usuario=" + Usuario + "&refresh_token=" + localStorage.getItem("refresh_token"), options);

    }

    
   public ConvertirFactura(det: iFactPed) : Observable<string>{

    var options = {
        'headers': {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'content-type': 'application/json'
        }
      };


      
      let data : iData = {} as iData;
      data.d = det;
      data.refresh_token = localStorage.getItem("refresh_token");


    return this.http.post<any>(this._Cnx.Url() + "Factura/ConvertirFactura", JSON.stringify(data), options);

 }

 public PagarFactura(det: iFacturaPagoCancelacion) : Observable<string>{

    var options = {
        'headers': {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'content-type': 'application/json'
        }
      };


      
      let data : iData = {} as iData;
      data.d = det;
      data.refresh_token = localStorage.getItem("refresh_token");



    return this.http.post<any>(this._Cnx.Url() + "Factura/PagarFactura", JSON.stringify(data), options);

 }


 public LiberarExistencia(Prod : string[], Usuario : string) : Observable<string>{

    let d : iLiberarExixtencia = {} as iLiberarExixtencia;
    d.Prod = Prod;
    d.Usuario = Usuario;

    
    var options = {
        'headers': {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'content-type': 'application/json'
        }
      };

    let data : iData = {} as iData;
    data.d = d;
    data.refresh_token = localStorage.getItem("refresh_token");


    return this.http.post<any>(this._Cnx.Url() + "Factura/LiberarExistencia", JSON.stringify(data), options);

 }
 

 public LiberarPrecios(d : iLiberacionPrecio[]) : Observable<string>{


    
    var options = {
        'headers': {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'content-type': 'application/json'
        }
      };

    let data : iData = {} as iData;
    data.d = d;
    data.refresh_token = localStorage.getItem("refresh_token");


    return this.http.post<any>(this._Cnx.Url() + "Factura/LiberarPrecios", JSON.stringify(data), options);

 }


 public LiberarBonificacion(d : iLiberacionBonif[]) : Observable<string>{


    
    var options = {
        'headers': {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
          'content-type': 'application/json'
        }
      };

    let data : iData = {} as iData;
    data.d = d;
    data.refresh_token = localStorage.getItem("refresh_token");


    return this.http.post<any>(this._Cnx.Url() + "Factura/LiberarBonificacion", JSON.stringify(data), options);

 }

}
import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iFactPed } from "../interface/i-Factura-Pedido";
import { iFacturaPagoCancelacion } from "../interface/i-Factura-Pago-Cancelacion";
import { iLiberarExixtencia } from "../interface/i-Liberar-Existencia";
import { iLiberacionPrecio } from "../interface/i-Liberacion-Precio";

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
        return this.http.post<any>(this._Cnx.Url() + "Factura/Guardar", JSON.stringify(d), { headers: { 'content-type': 'application/json' } });

    }

    AnularFactura(IdDoc : string, Motivo: string, Usuario: string) : Observable<string> { 
        return this.http.post<any>(this._Cnx.Url() + "Factura/Anular?IdDoc=" + IdDoc + "&Motivo=" + Motivo + "&Usuario=" + Usuario, { headers: { 'content-type': 'application/text' } });

    }

    
   public ConvertirFactura(det: iFactPed) : Observable<string>{

    return this.http.post<any>(this._Cnx.Url() + "Factura/ConvertirFactura", JSON.stringify(det), { headers: { 'content-type': 'application/json' } });

 }

 public PagarFactura(det: iFacturaPagoCancelacion) : Observable<string>{

    return this.http.post<any>(this._Cnx.Url() + "Factura/PagarFactura", JSON.stringify(det), { headers: { 'content-type': 'application/json' } });

 }


 public LiberarExistencia(Prod : string[], Usuario : string) : Observable<string>{

    let d : iLiberarExixtencia = {} as iLiberarExixtencia;
    d.Prod = Prod;
    d.Usuario = Usuario;
    return this.http.post<any>(this._Cnx.Url() + "Factura/LiberarExistencia", JSON.stringify(d), { headers: { 'content-type': 'application/json' } });

 }
 

 public LiberarPrecios(d : iLiberacionPrecio[]) : Observable<string>{


    return this.http.post<any>(this._Cnx.Url() + "Factura/LiberarPrecios", JSON.stringify(d), { headers: { 'content-type': 'application/json' } });

 }

}
import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iFichaCliente } from "../interface/i-ficha-cliente";


@Injectable({
    providedIn: 'root',
  })
export class postEstadoCuenta{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

    GuardarPermiso(d : iFichaCliente) : Observable<string> { 
        return this.http.post<any>(this._Cnx.Url() + "CXC/EstadoCuenta/GuardarPermiso", JSON.stringify(d), { headers: { 'content-type': 'application/json' } });

    }


}
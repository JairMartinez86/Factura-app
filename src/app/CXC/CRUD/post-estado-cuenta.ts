import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iFichaCliente } from "../interface/i-ficha-cliente";
import { iData } from "src/app/SIS/Interface/Data";


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

        var options = {
            'headers': {
              'Authorization': 'Bearer ' + localStorage.getItem("token"),
              'content-type': 'application/json'
            }
          };

          

        let data : iData = {} as iData;
        data.d = d;
        data.refresh_token = localStorage.getItem("refresh_token");

        return this.http.post<any>(this._Cnx.Url() + "CXC/EstadoCuenta/GuardarPermiso", JSON.stringify(data), options);

    }


}
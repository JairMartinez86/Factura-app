import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iPerfil } from "../interface/i-Perfiles";
import { iData } from "src/app/SIS/Interface/Data";

@Injectable({
    providedIn: 'root',
  })
export class postServidor{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

    GuardarAcceso(d : iPerfil[]) : Observable<string> { 

        var options = {
            'headers': {
              'Authorization': 'Bearer ' + localStorage.getItem("token"),
              'content-type': 'application/json'
            }
          };

          

        let data : iData = {} as iData;
        data.d = d;
        data.refresh_token = localStorage.getItem("refresh_token");

        

        return this.http.post<any>(this._Cnx.Url() + "SIS/GuardarAcceso", data, options);

    }


}
import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { iParamReporte } from "src/app/INV/Interface/I-Param-Reporte";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";

@Injectable({
    providedIn: 'root',
})
export class postReporteInv {

    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor() {

        this.http = new HttpClient(new HttpXhrBackend({
            build: () => new XMLHttpRequest()
        }));

    }

    public Imprimir(d: iParamReporte): Observable<string> {



        return this.http.post<any>(this._Cnx.Url() + "INV/Reporte/Imprimir", JSON.stringify(d), { headers: { 'content-type': 'application/json' } });
    }



}
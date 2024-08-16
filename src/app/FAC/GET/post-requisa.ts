import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iData } from "src/app/SIS/Interface/Data";

@Injectable({
  providedIn: 'root',
})
export class postRequisa {

  private _Cnx = new Conexion();
  private http: HttpClient;

  constructor() {

    this.http = new HttpClient(new HttpXhrBackend({
      build: () => new XMLHttpRequest()
    }));

  }

  public GetRequisa(): Observable<string> {

    var options = {
      'headers': {
        'Authorization': 'Bearer ' + localStorage.getItem("token"),
        'content-type': 'application/json'
      }
    };


    return this.http.get<any>(this._Cnx.Url() + "INV/Requisa/Get?refresh_token=" + localStorage.getItem("refresh_token"), options);
  }

  Autorizar(IdRequisa: any): Observable<string> {

    var options = {
      'headers': {
        'Authorization': 'Bearer ' + localStorage.getItem("token"),
        'content-type': 'application/json'
      }
    };

    return this.http.get<any>(this._Cnx.Url() + "INV/Requisa/Autorizar?IdRequisa=" + IdRequisa + "&refresh_token=" + localStorage.getItem("refresh_token"), options);

  }


  public GetPermiso(): Observable<string> {

    var options = {
      'headers': {
        'Authorization': 'Bearer ' + localStorage.getItem("token"),
        'content-type': 'application/json'
      }
    };

    return this.http.get<any>(this._Cnx.Url() + "INV/Requisa/GetPermiso?refresh_token="+ localStorage.getItem("refresh_token"), options);
  }


  AutorizarPermiso(d : any[]): Observable<string> {

    var options = {
      'headers': {
        'Authorization': 'Bearer ' + localStorage.getItem("token"),
        'content-type': 'application/json'
      }
    };

    let data : iData = {} as iData;
    data.d = d;
    data.refresh_token = localStorage.getItem("refresh_token");


    return this.http.post<any>(this._Cnx.Url() + "INV/Requisa/AutorizarPermiso", JSON.stringify(data), options);

  }

}
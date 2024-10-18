import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";

@Injectable({
  providedIn: 'root',
})
export class getRequisa {

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
        'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
        'content-type': 'application/json'
      }
    };
  

    return this.http.get<any>(this._Cnx.Url() + "INV/Requisa/Get?refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
  }

  Autorizar(IdRequisa: any): Observable<string> {

    var options = {
      'headers': {
        'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
        'content-type': 'application/json'
      }
    };

    return this.http.get<any>(this._Cnx.Url() + "INV/Requisa/Autorizar?IdRequisa=" + IdRequisa + "&refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);

  }


  public GetPermiso(): Observable<string> {

    var options = {
      'headers': {
        'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
        'content-type': 'application/json'
      }
    };

    return this.http.get<any>(this._Cnx.Url() + "INV/Requisa/GetPermiso?refresh_token=" + localStorage.getItem("FAC_refresh_token"), options);
  }

}
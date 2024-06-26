import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";

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

  public GetRequisa(usuario: string): Observable<string> {
    return this.http.get<any>(this._Cnx.Url() + "INV/Requisa/Get?usuario=" + usuario);
  }

  Autorizar(IdRequisa: any, Usuario: string): Observable<string> {
    return this.http.get<any>(this._Cnx.Url() + "INV/Requisa/Autorizar?IdRequisa=" + IdRequisa + "&Usuario=" + Usuario);

  }


  public GetPermiso(): Observable<string> {
    return this.http.get<any>(this._Cnx.Url() + "INV/Requisa/GetPermiso");
  }


  AutorizarPermiso(d : any[]): Observable<string> {
    return this.http.post<any>(this._Cnx.Url() + "INV/Requisa/AutorizarPermiso", JSON.stringify(d), { headers: { 'content-type': 'application/json' } });

  }

}
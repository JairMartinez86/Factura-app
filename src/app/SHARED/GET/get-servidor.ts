import { HttpClient, HttpHeaders, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iUsuario } from "src/app/SIS/Interface/Usuario";
import { iLogin } from "../interface/i-login";


@Injectable({
    providedIn: 'root',
  })
export class getServidor{
    
  private _Cnx = new Conexion();
  private http: HttpClient;
  private config: { version: string };


  constructor(){

      this.http = new HttpClient(new HttpXhrBackend({ 
          build: () => new XMLHttpRequest() 
      }));

  }

  public FechaServidor() : Observable<any>{

  
    var options = {
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ localStorage.getItem("FAC_token")
      }
    };



    return this.http.get<any>(this._Cnx.Url() + "SIS/FechaServidor?refresh_token="+ localStorage.getItem("FAC_refresh_token") , options);
 }
  
 public Autorize(user: string, pass : string) : Observable<any>{
  return this.http.post<any>(this._Cnx.Url() + "SIS/Autorize?user=" + user + "&pass=" + pass,  { headers: { 'content-type': 'application/text' } });

}


public Login(l : iLogin) : Observable<any>{

  var options = {
    'headers': {
      'Authorization': 'Bearer ' + l.Token.access_token,
      'content-type': 'application/json'
    }
  };

  
return this.http.post<any>(this._Cnx.Url() + "SIS/Login",   JSON.stringify(l), options);

}


public AccesoWeb() : Observable<any>{

  var options = {
    'headers': {
      'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
      'content-type': 'application/json'
    }
  };


  return this.http.get<any>(this._Cnx.Url() + "SIS/AccesoWeb?refresh_token=" + localStorage.getItem("FAC_refresh_token"), options );
}



public  Version()
{


  this.config = require("src/assets/config.json");

  const headers = new HttpHeaders()
    .set('Cache-Control', 'no-cache')
    .set('Pragma', 'no-cache');


  this.http
    .get<{ version: string }>("./assets/config.json", { headers })
    .subscribe(config => {

      if (config.version !== this.config.version) {

        location.reload();
      }
    });

}


 

}
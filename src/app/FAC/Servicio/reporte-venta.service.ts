import { HttpClient, HttpXhrBackend } from '@angular/common/http';
import { EventEmitter, Injectable, Input, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { iReporteService } from 'src/app/INV/Interface/i-Reporte-Service';
import { Conexion } from 'src/app/SHARED/class/Cadena_Conexion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';


@Injectable({
    providedIn: 'root'
})
export class ReporteVentaService {
    @Output() Salida: EventEmitter<iReporteService[]> = new EventEmitter();
    @Input() public Filtro: EventEmitter<any[]> = new EventEmitter();


    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(private cFunciones: Funciones,) {



        this.http = new HttpClient(new HttpXhrBackend({
            build: () => new XMLHttpRequest()
        }));


        

    }


    public V_Iniciar(){
        this.V_Llenar_Datos();
    }

    private V_Llenar_Datos(): void {

        let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
            WaitComponent,
            {

                panelClass: "escasan-dialog-full-blur",
                data: "",
            }
        );

        var options = {
            'headers': {
              'Authorization': 'Bearer ' + localStorage.getItem("FAC_token"),
              'content-type': 'application/json'
            }
          };


        this.http.get<any>(this._Cnx.Url() + "FAC/Reporte/GetDatos?refresh_token="+ localStorage.getItem("FAC_refresh_token"), options).subscribe(
            {
                next: (s) => {

                    dialogRef.close();
                    let _json = JSON.parse(s);
                    this.cFunciones.ActualizarToken(_json["token"]);


                    if (_json["esError"] == 1) {
                        if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
                            this.cFunciones.DIALOG.open(DialogErrorComponent, {
                                id: "error-servidor-msj",
                                data: _json["msj"].Mensaje,
                            });
                        }
                    } else {
                        let Datos: iDatos[] = _json["d"];


                        //Datos[0].d GRUPO
                        //Datos[1].d SUB GRUPO
                        //Datos[2].d LINEA
                        //Datos[3].d BODEGA





                        let F1 : iReporteService = {} as iReporteService;
                        F1.Filtro = "Filtro1";
                        F1.Datos = [Datos[0].d, Datos[1].d, Datos[2].d];

                        let F2 : iReporteService = {} as iReporteService;
                        F2.Filtro = "Filtro2";
                        F2.Datos = [Datos[3].d];



                        this.Salida.emit([F1,F2,]);




                    }

                },
                error: (err) => {
                    dialogRef.close();

                    if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                        this.cFunciones.DIALOG.open(DialogErrorComponent, {
                            id: "error-servidor",
                            data: "<b class='error'>" + err.message + "</b>",
                        });
                    }
                },
                complete: () => {

                }
            }
        );


    }






}

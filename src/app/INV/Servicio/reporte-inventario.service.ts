import { HttpClient, HttpXhrBackend } from '@angular/common/http';
import { EventEmitter, Injectable, Input, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Conexion } from 'src/app/SHARED/class/Cadena_Conexion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { iReporteService } from '../Interface/i-Reporte-Service';

@Injectable({
    providedIn: 'root'
})
export class ReporteInventarioService {
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


        this.http.get<any>(this._Cnx.Url() + "INV/Reporte/GetDatos?refresh_token="+ localStorage.getItem("FAC_refresh_token"), options).subscribe(
            {
                next: (s) => {

                    dialogRef.close();
                    let _json = JSON.parse(s);
                    this.cFunciones.ActualizarToken(_json["FAC_token"]);


                    if (_json["esError"] == 1) {
                        if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
                            this.cFunciones.DIALOG.open(DialogErrorComponent, {
                                id: "error-servidor-msj",
                                data: _json["msj"].Mensaje,
                            });
                        }
                    } else {
                        let Datos: iDatos[] = _json["d"];

                        //Datos[0].d BODEGAS
                        //Datos[1].d PRODUCTOS
                        //Datos[2].d PROVEEDORES
                        //Datos[3].d GRUPO PRESUPUESTO
                        //Datos[4].d GRUPO
                        //Datos[5].d SUB GRUPO
                        //Datos[6].d SERIES
                        //Datos[7].d TIPO MOV
                        //Datos[8].d CLIENTES




                        let F2 : iReporteService = {} as iReporteService;
                        F2.Filtro = "Filtro2";
                        F2.Datos = [Datos[0].d, Datos[1].d, Datos[7].d];


                        let F3 : iReporteService = {} as iReporteService;
                        F3.Filtro = "Filtro3";
                        F3.Datos = [Datos[6].d];


                        let F4 : iReporteService = {} as iReporteService;
                        F4.Filtro = "Filtro4";
                        F4.Datos = [Datos[2].d, Datos[3].d, Datos[4].d, Datos[5].d];

                        let F5 : iReporteService = {} as iReporteService;
                        F5.Filtro = "Filtro5";
                        F5.Datos = [Datos[3].d, Datos[4].d];

                        let F6 : iReporteService = {} as iReporteService;
                        F6.Filtro = "Filtro6";
                        F6.Datos = [Datos[7].d];

                        let F7 : iReporteService = {} as iReporteService;
                        F7.Filtro = "Filtro7";
                        F7.Datos = [Datos[0].d];


                        let F8 : iReporteService = {} as iReporteService;
                        F8.Filtro = "Filtro8";
                        F8.Datos = [Datos[8].d];

                        let F9 : iReporteService = {} as iReporteService;
                        F8.Filtro = "Filtro9";
                        F8.Datos = [Datos[8].d];


                        this.Salida.emit([F2, F3, F4, F5, F6, F7, F8, F9]);




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

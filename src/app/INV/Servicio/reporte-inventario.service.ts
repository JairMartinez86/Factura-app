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


        this.http.get<any>(this._Cnx.Url() + "INV/Reporte/GetDatos").subscribe(
            {
                next: (s) => {

                    dialogRef.close();
                    let _json = JSON.parse(s);

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



                        let F2 : iReporteService = {} as iReporteService;
                        F2.Filtro = "Filtro2";
                        F2.Datos = [Datos[0].d, Datos[1].d];


                        let F3 : iReporteService = {} as iReporteService;
                        F3.Filtro = "Filtro3";
                        F3.Datos = [Datos[6].d];


                        let F4 : iReporteService = {} as iReporteService;
                        F4.Filtro = "Filtro4";
                        F4.Datos = [Datos[2].d, Datos[3].d, Datos[4].d, Datos[5].d];

                        let F5 : iReporteService = {} as iReporteService;
                        F4.Filtro = "Filtro5";
                        F4.Datos = [Datos[3].d, Datos[4].d];

                     



                        this.Salida.emit([F2, F3, F4]);




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

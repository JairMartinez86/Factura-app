import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteInventarioService } from 'src/app/INV/Servicio/reporte-inventario.service';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iParamReporte } from 'src/app/INV/Interface/I-Param-Reporte';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { ReporteInventarioFiltro2Component } from '../Filtros/reporte-inventario-filtro-2/reporte-inventario-filtro-2.component';
import { postReporteInv } from '../../POST/post-Reporte';
import { concat } from 'rxjs';
import { GlobalPositionStrategy } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';

@Component({
    selector: 'app-reporte-inventario-transacc-diaria',
    standalone: true,
    templateUrl: './reporte-inventario-transacc-diaria.component.html',
    styleUrl: './reporte-inventario-transacc-diaria.component.scss',
    imports: [ReporteInventarioFiltro2Component]
})
export class ReporteInventarioTransaccDiariaComponent {

    @ViewChild("Filtro", { static: false })
    public Filtro: ReporteInventarioFiltro2Component;

    constructor(public servicio: ReporteInventarioService, private POST: postReporteInv, public cFunciones: Funciones
    ) {

    }


    public V_Imprimir(Exportar: boolean): void {


        
        this.Filtro.val.EsValido();


        if (this.Filtro.val.Errores != "") {

            this.cFunciones.DIALOG.open(DialogErrorComponent, {
                data:
                    "<ul>" + this.Filtro.val.Errores + "</ul>",
            });
            return;

        }


        document.getElementById("btnImprimir-Reporte-Inv-transac-diaria")?.setAttribute("disabled", "disabled");

        let dialogRef: any = this.cFunciones.DIALOG.getDialogById("wait");


        if (dialogRef == undefined) {
            dialogRef = this.cFunciones.DIALOG.open(
                WaitComponent,
                {
                    panelClass: "escasan-dialog-full-blur",
                    data: "",
                    id: "wait"
                }
            );

        }

        let d: iParamReporte = {} as iParamReporte;
        d.Param = [this.Filtro.val.Get("cmbProducto1").value[0], this.Filtro.val.Get("cmbProducto2").value[0], this.Filtro.val.Get("cmbBodega").value, this.Filtro.val.Get("cmbTipoMov").value[0], this.Filtro.val.Get("txtFecha1").value, this.Filtro.val.Get("txtFecha2").value]

        let Bodegas: String = "";

        if (d.Param[2].length > 0) {
            Bodegas = ">";
            d.Param[2].forEach((e: any) => {
                Bodegas +=   e + "@";
            });
            
        }
        
        d.Param[2] = Bodegas;
        d.Param[4] = this.cFunciones.DateFormat(d.Param[4], "dd/MM/yyyy");
        d.Param[5] = this.cFunciones.DateFormat(d.Param[5], "dd/MM/yyyy");

       

        d.TipoReporte = "Detalle Transacciones Inventario";
        d.Exportar = Exportar;

        this.POST.Imprimir(d).subscribe(
            {
                next: (data) => {


                    dialogRef.close();
                    let _json = JSON.parse(data);

                    if (_json["esError"] == 1) {
                        if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
                            this.cFunciones.DIALOG.open(DialogErrorComponent, {
                                id: "error-servidor-msj",
                                data: _json["msj"].Mensaje,
                            });
                        }
                    } else {
                        this.V_GenerarDoc(_json["d"], Exportar);
                    }

                },
                error: (err) => {

                    document.getElementById("btnImprimir-Reporte-Inv-transac-diaria")?.removeAttribute("disabled");

                    dialogRef.close();

                    if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                        this.cFunciones.DIALOG.open(DialogErrorComponent, {
                            id: "error-servidor",
                            data: "<b class='error'>" + err.message + "</b>",
                        });
                    }

                },
                complete: () => {
                    document.getElementById("btnImprimir-Reporte-Inv-transac-diaria")?.removeAttribute("disabled");

                }
            }
        );


    }


    private V_GenerarDoc(Datos: iDatos, Exportar: boolean) {


        let byteArray = new Uint8Array(atob(Datos.d).split('').map(char => char.charCodeAt(0)));

        var file = new Blob([byteArray], { type: (Exportar ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/pdf') });


        let url = URL.createObjectURL(file);
    
       
        var fileLink = document.createElement('a');
        fileLink.href = url;
        fileLink.download = Datos.Nombre;


        if (Exportar) {

            var fileLink = document.createElement('a');
            fileLink.href = url;
            fileLink.download = Datos.Nombre;
            fileLink.click();
            document.body.removeChild(fileLink);
        }
        else {
            let tabOrWindow: any = window.open('',  '_blank');
            tabOrWindow.document.body.appendChild(fileLink);

            tabOrWindow.document.write("<html><head><title>"+Datos.Nombre+"</title></head><body>"
                + '<embed width="100%" height="100%" name="plugin" src="'+ url+ '" '
                + 'type="application/pdf" internalinstanceid="21"></body></html>');

            tabOrWindow.focus();
        }

    

    }


    private ngDoCheck() {
        this.Filtro?.val?.ComboOverLay(this.Filtro.lstCmb,  ["cmbBodega"]);
    
    }

    


    private ngAfterViewInit() {

        this.Filtro?.val.Combo(this.Filtro.lstCmb);
    
    
        ///CAMBIO DE FOCO
        this.Filtro.val.addFocus("txtFecha1", "txtFecha2", undefined);
        this.Filtro.val.addFocus("txtFecha2", "cmbBodega", undefined);
        this.Filtro.val.addFocus("cmbBodega", "cmbTipoMov", undefined);
        this.Filtro.val.addFocus("cmbTipoMov", "cmbProducto1", undefined);
        this.Filtro.val.addFocus("cmbProducto1", "cmbProducto2", undefined);
        this.Filtro.val.addFocus("cmbProducto2", "btnImprimir-Reporte-Inv-transac-proceso", "click");
      
    
    
    
      }

      

    private ngOnInit() {
        this.servicio.V_Iniciar();

    }
}

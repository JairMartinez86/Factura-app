import { Component, ViewChild } from '@angular/core';
import { postReporteInv } from '../../POST/post-Reporte';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iParamReporte } from 'src/app/INV/Interface/I-Param-Reporte';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { ReporteInventarioFiltro1Component } from "../Filtros/reporte-inventario-filtro-1/reporte-inventario-filtro-1.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  IgxDatePickerModule, IgxIconModule } from 'igniteui-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporte-inventario-ultimas-compras',
  standalone: true,
  imports: [ReporteInventarioFiltro1Component, MatPaginator, MatTableModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule, IgxDatePickerModule ],
  templateUrl: './reporte-inventario-ultimas-compras.component.html',
  styleUrl: './reporte-inventario-ultimas-compras.component.scss'
})
export class ReporteInventarioUltimasComprasComponent {

  public val = new Validacion();
  
  public lstDocumentos: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ["col1"];


  
  constructor(private POST: postReporteInv, public cFunciones: Funciones
  ) {
    this.val.add("txtFecha1", "1", "LEN>", "0", "Seleccione una Fecha", "");
    this.val.add("txtBuscar", "1", "LEN>=", "0", "Buscar", "");

    this.val.Get("txtFecha1").setValue(this.cFunciones.ShortFechaServidor());
  }

  
  public V_Imprimir(Exportar: boolean): void {
    document.getElementById("btnImprimir-Reporte-Inv-ultima-compra")?.setAttribute("disabled", "disabled");

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
   
    d.TipoReporte = "Ultima Compra";
    d.Param = [this.val.Get("txtFecha1").value, this.val.Get("txtBuscar").value]
    d.Exportar = Exportar;

    this.POST.Imprimir(d).subscribe(
        {
            next: (data) => {


                dialogRef.close();
                let _json = JSON.parse(data);
                this.cFunciones.ActualizarToken(_json["token"]);

                if (_json["esError"] == 1) {
                    if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
                        this.cFunciones.DIALOG.open(DialogErrorComponent, {
                            id: "error-servidor-msj",
                            data: _json["msj"].Mensaje,
                        });
                    }
                } else {


                  let Datos: iDatos = _json["d"];

                
                    if(Datos.d[1] == true)this.V_GenerarDoc(Datos, true);
                    if(Datos.d[1] != true) {
                      this.lstDocumentos = new MatTableDataSource(Datos.d[0]);
                      this.lstDocumentos.paginator = this.paginator;
         
                    }

                     
                }

            },
            error: (err) => {

                document.getElementById("btnImprimir-Reporte-Inv-ultima-compra")?.removeAttribute("disabled");

                dialogRef.close();

                if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                    this.cFunciones.DIALOG.open(DialogErrorComponent, {
                        id: "error-servidor",
                        data: "<b class='error'>" + err.message + "</b>",
                    });
                }

            },
            complete: () => {
                document.getElementById("btnImprimir-Reporte-Inv-ultima-compra")?.removeAttribute("disabled");

            }
        }
    );


}


private V_GenerarDoc(Datos: any, Exportar: boolean) {


    let byteArray = new Uint8Array(atob(Datos.d[0]).split('').map(char => char.charCodeAt(0)));

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

public v_Filtrar(event: any) {
  this.lstDocumentos.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
}


private ngAfterViewInit() {

  this.val.addFocus("txtFecha1", "txtBuscar", "click");
  this.val.addFocus("txtBuscar", "btnImprimir-Reporte-Inv-ultima-compra", "click");
  
}




}

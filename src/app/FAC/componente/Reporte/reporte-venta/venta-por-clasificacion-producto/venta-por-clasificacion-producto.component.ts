import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { postReporteVta } from 'src/app/FAC/POST/post-Reporte-Venta';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iParamReporte } from 'src/app/INV/Interface/I-Param-Reporte';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { ReporteInventarioFiltro1Component } from "../../../../../INV/componente/Reporte/reporte-inventario/Filtros/reporte-inventario-filtro-1/reporte-inventario-filtro-1.component";

@Component({
  selector: 'app-venta-por-clasificacion-producto',
  standalone: true,
  imports: [ ReactiveFormsModule, ReporteInventarioFiltro1Component],
  templateUrl: './venta-por-clasificacion-producto.component.html',
  styleUrl: './venta-por-clasificacion-producto.component.scss'
})
export class VentaPorClasificacionProductoComponent {

  @ViewChild("Filtro1", { static: false })
  public Filtro1: ReporteInventarioFiltro1Component;

  public val = new Validacion();

  public constructor( public cFunciones: Funciones, private POST : postReporteVta){
    this.val.add("cmbTipo", "1", "LEN>", "0", "", "Seleccione un tipo de reporte");
    this.val.add("cmbMoneda", "1", "LEN>", "0", "", "Seleccione una moneda");

    this.val.SetValue("cmbTipo", "E");
    this.val.SetValue("cmbMoneda", this.cFunciones.MonedaLocal);
    
  }




  private ngAfterViewInit() {


    ///CAMBIO DE FOCO
    this.Filtro1?.val.addFocus("txtFecha1", "txtFecha2", undefined);
    this.Filtro1?.val.addFocus("txtFecha2", "cmbMoneda", undefined);
    this.Filtro1?.val.addFocus("cmbMoneda", "cmbTipo", undefined);
    this.Filtro1?.val.addFocus("cmbTipo", "btnImprimir-Reporte-venta-class-product", "click");


   
  }



  public V_Imprimir(Exportar: boolean): void {


    
    this.Filtro1.val.EsValido();


    if (this.Filtro1.val.Errores != "") {

        this.cFunciones.DIALOG.open(DialogErrorComponent, {
            data:
                "<ul>" + this.Filtro1.val.Errores + "</ul>",
        });
        return;

    }





    document.getElementById("btnImprimir-Reporte-venta-class-product")?.setAttribute("disabled", "disabled");

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
    d.Param = [this.Filtro1.val.GetValue("txtFecha1"), this.Filtro1.val.GetValue("txtFecha2"),  this.val.GetValue("cmbMoneda"), this.val.GetValue("cmbTipo")];

    d.Param[0] = this.cFunciones.DateFormat(d.Param[0], "dd/MM/yyyy");
    d.Param[1] = this.cFunciones.DateFormat(d.Param[1], "dd/MM/yyyy");;

    d.TipoReporte = "VentasPorClassProd";
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
                    this.V_GenerarDoc(_json["d"], Exportar);
                }

            },
            error: (err) => {

                document.getElementById("btnImprimir-Reporte-venta-class-product")?.removeAttribute("disabled");

                dialogRef.close();

                if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                    this.cFunciones.DIALOG.open(DialogErrorComponent, {
                        id: "error-servidor",
                        data: "<b class='error'>" + err.message + "</b>",
                    });
                }

            },
            complete: () => {
                document.getElementById("btnImprimir-Reporte-venta-class-product")?.removeAttribute("disabled");

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
      let tabOrWindow: any = window.open('', '_blank');
      tabOrWindow.document.body.appendChild(fileLink);

      tabOrWindow.document.write("<html><head><title>" + Datos.Nombre + "</title></head><body>"
        + '<embed width="100%" height="100%" name="plugin" src="' + url + '" '
        + 'type="application/pdf" internalinstanceid="21"></body></html>');

      tabOrWindow.focus();
    }



  }



}

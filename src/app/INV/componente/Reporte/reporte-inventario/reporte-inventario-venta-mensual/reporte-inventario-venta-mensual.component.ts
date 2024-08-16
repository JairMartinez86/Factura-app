import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReporteInventarioFiltro2Component } from "../Filtros/reporte-inventario-filtro-2/reporte-inventario-filtro-2.component";
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { iParamReporte } from 'src/app/INV/Interface/I-Param-Reporte';
import { postReporteInv } from '../../POST/post-Reporte';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { ReporteInventarioService } from 'src/app/INV/Servicio/reporte-inventario.service';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporte-inventario-venta-mensual',
  standalone: true,
  imports: [ReporteInventarioFiltro2Component, ReactiveFormsModule, CommonModule, FormsModule,],
  templateUrl: './reporte-inventario-venta-mensual.component.html',
  styleUrl: './reporte-inventario-venta-mensual.component.scss'
})
export class ReporteInventarioVentaMensualComponent {
  @ViewChild("Filtro", { static: false })
  public Filtro: ReporteInventarioFiltro2Component;

  public val = new Validacion();

  constructor(public servicio: ReporteInventarioService, private POST: postReporteInv, public cFunciones: Funciones
  ) {
    this.val.add("cmbMoneda", "1", "LEN>", "0", "Moneda", "Seleccione una Moneda");

    this.val.Get("cmbMoneda").setValue(this.cFunciones.MonedaLocal);
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




    document.getElementById("btnImprimir-Reporte-Inv-ventas-mensuales")?.setAttribute("disabled", "disabled");

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
    d.Param = [this.Filtro.val.Get("txtFecha1").value, this.Filtro.val.Get("txtFecha2").value, "", this.Filtro.val.Get("cmbProducto1").value[0], this.Filtro.val.Get("cmbProducto2").value[0], this.val.Get("cmbMoneda").value]
    d.TipoReporte = "Ventas Mensuales";
    d.Exportar = Exportar;

    d.Param[0] = this.cFunciones.DateFormat(d.Param[0], "dd/MM/yyyy");
    d.Param[1] = this.cFunciones.DateFormat(d.Param[1], "dd/MM/yyyy");


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

          document.getElementById("btnImprimir-Reporte-Inv-ventas-mensuales")?.removeAttribute("disabled");

          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnImprimir-Reporte-Inv-ventas-mensuales")?.removeAttribute("disabled");

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



  
  private ngAfterViewInit() {


    this.Filtro.val.Combo(this.Filtro?.lstCmb);

    ///CAMBIO DE FOCO
    this.Filtro?.val.addFocus("txtFecha1", "txtFecha2", undefined);
    this.Filtro?.val.addFocus("txtFecha2", "cmbProducto1", undefined);
    this.Filtro?.val.addFocus("cmbProducto1", "cmbProducto2", undefined);
    this.Filtro?.val.addFocus("cmbProducto2", "btnImprimir-Reporte-Inv-ventas-mensuales", "click");


  }

  
  private ngOnInit() {
    this.servicio.V_Iniciar();
  }

}

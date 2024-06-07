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


  public V_Imprimir(Exportar : boolean): void {
      document.getElementById("btnImprimir-Reporte-Inv")?.setAttribute("disabled", "disabled");

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
      
      let Bodegas : String = "";

      if(d.Param[2] !+= "")
        {
            d.Param[2].forEach((e : any) => {
                Bodegas += "'" + e + "'," ;
              });
              d.Param[2] = Bodegas.substring(0, Bodegas.length -1);
        }

     
      
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



                      let Datos: iDatos = _json["d"];


                      let byteArray = new Uint8Array(atob(Datos.d).split('').map(char => char.charCodeAt(0)));

                      var file = new Blob([byteArray], { type: 'application/pdf' });

                      let url = URL.createObjectURL(file);

                      let tabOrWindow: any = window.open(url, '_blank');
                      tabOrWindow.focus();




                  }

              },
              error: (err) => {

                  document.getElementById("btnImprimir-Reporte-Inv")?.removeAttribute("disabled");

                  dialogRef.close();

                  if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                      this.cFunciones.DIALOG.open(DialogErrorComponent, {
                          id: "error-servidor",
                          data: "<b class='error'>" + err.message + "</b>",
                      });
                  }

              },
              complete: () => {
                  document.getElementById("btnImprimir-Reporte-Inv")?.removeAttribute("disabled");

              }
          }
      );


  }


  private ngOnInit() {
      this.servicio.V_Iniciar();
     
  }
}

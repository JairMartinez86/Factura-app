import { Component, ViewChild } from '@angular/core';
import { ReporteInventarioFiltro6Component } from "../Filtros/reporte-inventario-filtro-6/reporte-inventario-filtro-6.component";
import { ReporteInventarioService } from 'src/app/INV/Servicio/reporte-inventario.service';
import { postReporteInv } from '../../POST/post-Reporte';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iParamReporte } from 'src/app/INV/Interface/I-Param-Reporte';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { GlobalPositionStrategy } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';

@Component({
    selector: 'app-reporte-inventario-transacciones',
    standalone: true,
    templateUrl: './reporte-inventario-transacciones.component.html',
    styleUrl: './reporte-inventario-transacciones.component.scss',
    imports: [ReporteInventarioFiltro6Component]
})
export class ReporteInventarioTransaccionesComponent {
  @ViewChild("Filtro", { static: false })
  public Filtro: ReporteInventarioFiltro6Component;

  constructor(public servicio: ReporteInventarioService, private POST: postReporteInv, public cFunciones: Funciones
  ) {

  }


  public V_Imprimir(Exportar: boolean): void {
      document.getElementById("btnImprimir-Reporte-Inv-Transacciones")?.setAttribute("disabled", "disabled");

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
      d.Param = [this.Filtro.val.Get("txtFecha1").value, this.Filtro.val.Get("txtFecha2").value, this.Filtro.val.Get("cmbTipoMov").value[0]]
      d.TipoReporte = "Transacciones de Inventario";
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

                  document.getElementById("btnImprimir-Reporte-Inv-Transacciones")?.removeAttribute("disabled");

                  dialogRef.close();

                  if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                      this.cFunciones.DIALOG.open(DialogErrorComponent, {
                          id: "error-servidor",
                          data: "<b class='error'>" + err.message + "</b>",
                      });
                  }

              },
              complete: () => {
                  document.getElementById("btnImprimir-Reporte-Inv-Transacciones")?.removeAttribute("disabled");

              }
          }
      );


  }


  private V_GenerarDoc(Datos: iDatos, Exportar: boolean) {


      let byteArray = new Uint8Array(atob(Datos.d).split('').map(char => char.charCodeAt(0)));

      var file = new Blob([byteArray], { type: (Exportar ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/pdf') });


      let url = URL.createObjectURL(file);
      console.log(url)
     
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




  private ngAfterViewInit() {


      this.Filtro.val.Combo(this.Filtro.lstCmb);
  
      ///CAMBIO DE FOCO
      this.Filtro.val.addFocus("txtFecha1", "txtFecha2", undefined);
      this.Filtro.val.addFocus("txtFecha2", "cmbTipoMov", undefined);
      this.Filtro.val.addFocus("cmbTipoMov", "btnImprimir-Reporte-Inv-Transacciones", "click");
      

      if (this.Filtro.cmbTipoMov != undefined) this.Filtro.cmbTipoMov.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";

  
      this.Filtro.overlaySettings = {};
  
      if (window.innerWidth <= 992) {
        this.Filtro.overlaySettings = {
          positionStrategy: new GlobalPositionStrategy({ openAnimation: scaleInCenter, closeAnimation: scaleOutCenter }),
          modal: true,
          closeOnOutsideClick: true
        };
      }
   
  
  
    }

    

  private ngOnInit() {
      this.servicio.V_Iniciar();

  }
}

import { Component, ViewChild } from '@angular/core';
import { ReporteInventarioFiltro7Component } from "../Filtros/reporte-inventario-filtro-7/reporte-inventario-filtro-7.component";
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
    selector: 'app-reporte-inventario-factura-costo',
    standalone: true,
    templateUrl: './reporte-inventario-factura-costo.component.html',
    styleUrl: './reporte-inventario-factura-costo.component.scss',
    imports: [ReporteInventarioFiltro7Component]
})
export class ReporteInventarioFacturaCostoComponent {
  @ViewChild("Filtro", { static: false })
  public Filtro: ReporteInventarioFiltro7Component;

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
      d.Param = [this.Filtro.val.Get("cmbBodega").value, this.Filtro.val.Get("txtFecha1").value, this.Filtro.val.Get("txtFecha2").value]

      let Bodegas: String = "";

      if (d.Param[0] != "") {
          Bodegas = ">";
          d.Param[0].forEach((e: any) => {
              Bodegas +=   e + "@";
          });
          d.Param[0] = Bodegas;
      }



      d.Param[0] = Bodegas;
      d.Param[1] = this.cFunciones.DateFormat(d.Param[1], "dd/MM/yyyy");
      d.Param[2] = this.cFunciones.DateFormat(d.Param[2], "dd/MM/yyyy");;

      d.TipoReporte = "Factura Costo";
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
      this.Filtro.val.addFocus("txtFecha2", "cmbBodega", undefined);
      this.Filtro.val.addFocus("cmbBodega", "cmbTipoMov", undefined);
      this.Filtro.val.addFocus("cmbTipoMov", "cmbProducto1", undefined);
      this.Filtro.val.addFocus("cmbProducto1", "cmbProducto2", undefined);
      this.Filtro.val.addFocus("cmbProducto2", "btnImprimir-Reporte-Inv-transac-proceso", "click");
      

      if (this.Filtro.cmbBodega != undefined) this.Filtro.cmbBodega.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";

  
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

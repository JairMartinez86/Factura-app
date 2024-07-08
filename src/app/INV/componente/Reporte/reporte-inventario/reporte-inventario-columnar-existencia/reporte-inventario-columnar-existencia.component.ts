import { Component, ViewChild } from '@angular/core';
import { ReporteInventarioFiltro4Component } from "../Filtros/reporte-inventario-filtro-4/reporte-inventario-filtro-4.component";
import { ReporteInventarioFiltro7Component } from "../Filtros/reporte-inventario-filtro-7/reporte-inventario-filtro-7.component";
import { postReporteInv } from '../../POST/post-Reporte';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iParamReporte } from 'src/app/INV/Interface/I-Param-Reporte';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { ReporteInventarioService } from 'src/app/INV/Servicio/reporte-inventario.service';
import { IgxDatePickerModule, IgxIconModule } from 'igniteui-angular';
import { ReporteInventarioFiltro2Component } from "../Filtros/reporte-inventario-filtro-2/reporte-inventario-filtro-2.component";

@Component({
    selector: 'app-reporte-inventario-columnar-existencia',
    standalone: true,
    templateUrl: './reporte-inventario-columnar-existencia.component.html',
    styleUrl: './reporte-inventario-columnar-existencia.component.scss',
    imports: [ReporteInventarioFiltro4Component, IgxDatePickerModule, IgxIconModule, ReporteInventarioFiltro2Component]
})
export class ReporteInventarioColumnarExistenciaComponent {
  @ViewChild("Filtro1", { static: false })
  public Filtro1: ReporteInventarioFiltro7Component;


  @ViewChild("Filtro2", { static: false })
  public Filtro2: ReporteInventarioFiltro4Component;


  constructor(public servicio: ReporteInventarioService, private POST: postReporteInv, public cFunciones: Funciones
  ) {

  }


  public V_Imprimir(Exportar: boolean): void {




      this.Filtro1.val.EsValido();
      this.Filtro2.val.EsValido();

      if (this.Filtro1.val.Errores != "") {

          this.cFunciones.DIALOG.open(DialogErrorComponent, {
              data:
                  "<ul>" + this.Filtro1.val.Errores + "</ul>",
          });
          return;

      }



      if (this.Filtro2.val.Errores != "") {

          this.cFunciones.DIALOG.open(DialogErrorComponent, {
              data:
                  "<ul>" + this.Filtro2.val.Errores + "</ul>",
          });
          return;

      }




      document.getElementById("btnImprimir-Reporte-Inv-columnar-existencia")?.setAttribute("disabled", "disabled");

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
      d.Param = [this.Filtro1.val.Get("txtFecha2").value, "", this.Filtro2.val.Get("cmbPresupuesto").value[0], this.Filtro2.val.Get("cmbProveedor").value[0], this.Filtro2.val.Get("cmbFamilia").value[0], this.Filtro2.val.Get("cmbSubFamilia").value[0], this.Filtro1.val.Get("cmbProducto1").value[0], this.Filtro1.val.Get("cmbProducto2").value[0], this.Filtro2.Negativo];
      d.TipoReporte = "Columnar Existencia";
      d.Exportar = Exportar;





      let Bodegas: String = "";

      if (d.Param[1].length > 0) {
          Bodegas = ">";
          d.Param[1].forEach((e: any) => {
              Bodegas +=   e + "@";
          });
          
      }


      d.Param[1] = Bodegas;



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

                  document.getElementById("btnImprimir-Reporte-Inv-columnar-existencia")?.removeAttribute("disabled");

                  dialogRef.close();

                  if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                      this.cFunciones.DIALOG.open(DialogErrorComponent, {
                          id: "error-servidor",
                          data: "<b class='error'>" + err.message + "</b>",
                      });
                  }

              },
              complete: () => {
                  document.getElementById("btnImprimir-Reporte-Inv-columnar-existencia")?.removeAttribute("disabled");

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


  private ngDoCheck() {
    this.Filtro1?.val?.ComboOverLay(this.Filtro1.lstCmb, ["cmbBodega"]);

}



  private ngAfterViewInit() {

    this.Filtro1.val.Combo(this.Filtro1.lstCmb);
    this.Filtro2.val.Combo(this.Filtro2.lstCmb);

      ///CAMBIO DE FOCO
       this.Filtro1.val.addFocus("txtFecha1", "txtFecha2", undefined);
       this.Filtro1.val.addFocus("txtFecha2", "cmbBodega", undefined);
       this.Filtro1.val.addFocus("cmbBodega", "cmbPresupuesto", undefined);
       this.Filtro1.val.addFocus("cmbPresupuesto", "cmbProveedor", undefined);
       this.Filtro1.val.addFocus("cmbProveedor", "cmbFamilia", undefined);
       this.Filtro1.val.addFocus("cmbFamilia", "cmbSubFamilia", undefined);
       this.Filtro1.val.addFocus("cmbSubFamilia", "btnImprimir-Reporte-Inv-columnar-existencia", "click");
  }

  private ngOnInit() {
    this.servicio.V_Iniciar();
}
}

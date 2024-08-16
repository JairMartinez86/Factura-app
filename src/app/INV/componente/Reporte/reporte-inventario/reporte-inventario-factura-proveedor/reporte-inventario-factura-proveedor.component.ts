import { Component, ViewChild } from '@angular/core';
import { ReporteInventarioFiltro1Component } from "../Filtros/reporte-inventario-filtro-1/reporte-inventario-filtro-1.component";
import { postReporteInv } from '../../POST/post-Reporte';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iParamReporte } from 'src/app/INV/Interface/I-Param-Reporte';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reporte-inventario-factura-proveedor',
  standalone: true,
  imports: [ReporteInventarioFiltro1Component],
  templateUrl: './reporte-inventario-factura-proveedor.component.html',
  styleUrl: './reporte-inventario-factura-proveedor.component.scss'
})
export class ReporteInventarioFacturaProveedorComponent {

  @ViewChild("Filtro", { static: false })
  public Filtro: ReporteInventarioFiltro1Component;
  
  constructor(private POST: postReporteInv, public cFunciones: Funciones
  ) {
  
  }
  
  public V_Confirmar(Exportar: boolean) {



    this.Filtro.val.EsValido();



    if (this.Filtro.val.Errores != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.Filtro.val.Errores,
      });

      return;
    }




    let dialogConfirmar: MatDialogRef<DialogoConfirmarComponent> = this.cFunciones.DIALOG.open(
      DialogoConfirmarComponent,
      {
        panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "escasan-dialog",
        disableClose: true
      }
    );
   
    
    
    dialogConfirmar.componentInstance.MostrarCerrar = true;
    
   

    dialogConfirmar.afterOpened().subscribe(s => {


      dialogConfirmar.componentInstance.textBoton1 = "CONSOLIDADO";
      dialogConfirmar.componentInstance.textBoton2 = "DETALLE";
      dialogConfirmar.componentInstance.Set_StyleBtn1("width: 150px");
      dialogConfirmar.componentInstance.Set_StyleBtn2("width: 150px");
      dialogConfirmar.componentInstance.SetMensajeHtml("<div style='text-align: center'><h6 style='text-align: center;'><b>IMPRIMIR</b></h6><p style='text-align: center; margin-top:5px;margin-bottom:5px'><b style='color: blue'>Tipo Reporte</b></p><div>")

    });

 

    dialogConfirmar.afterClosed().subscribe(s => {


      if (dialogConfirmar.componentInstance.retorno == "1") {

        this.V_Imprimir(Exportar, "C")
      }




      if (dialogConfirmar.componentInstance.retorno == "0") {
        this.V_Imprimir(Exportar, "D")
      }

    });




  }



  private V_Imprimir(Exportar: boolean, TipoReporte: string): void {




    document.getElementById("btnImprimir-Reporte-Inv-factura-proveedor")?.setAttribute("disabled", "disabled");

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
     d.Param = [this.Filtro.val.Get("txtFecha1").value, this.Filtro.val.Get("txtFecha2").value, TipoReporte]
     d.TipoReporte = "Factura Proveedor";
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

          document.getElementById("btnImprimir-Reporte-Inv-factura-proveedor")?.removeAttribute("disabled");

          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnImprimir-Reporte-Inv-factura-proveedor")?.removeAttribute("disabled");


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
  
  
  
  
  private ngAfterViewInit() {
  
  
      ///CAMBIO DE FOCO
      this.Filtro.val.addFocus("txtFecha1", "txtFecha2", undefined);
      this.Filtro.val.addFocus("txtFecha2", "btnImprimir-Reporte-Inv-factura-proveedor", "click");
  
  
  
    }
  
    
}

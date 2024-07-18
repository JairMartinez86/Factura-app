
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteInventarioService } from 'src/app/INV/Servicio/reporte-inventario.service';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iParamReporte } from 'src/app/INV/Interface/I-Param-Reporte';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { ReporteInventarioFiltro4Component } from '../Filtros/reporte-inventario-filtro-4/reporte-inventario-filtro-4.component';
import { ReporteInventarioFiltro2Component } from '../Filtros/reporte-inventario-filtro-2/reporte-inventario-filtro-2.component';
import { postReporteInv } from '../../POST/post-Reporte';
import { concat } from 'rxjs';
import { GlobalPositionStrategy } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reporte-inventario-venta-proveedor',
  standalone: true,
  imports: [ReporteInventarioFiltro2Component, ReporteInventarioFiltro4Component, FormsModule, ReactiveFormsModule],
  templateUrl: './reporte-inventario-venta-proveedor.component.html',
  styleUrl: './reporte-inventario-venta-proveedor.component.scss'
})
export class ReporteInventarioVentaProveedorComponent {
  @ViewChild("Filtro1", { static: false })
  public Filtro1: ReporteInventarioFiltro2Component;


  @ViewChild("Filtro2", { static: false })
  public Filtro2: ReporteInventarioFiltro4Component;

  public val = new Validacion();
  public Delivery: boolean = false;

  constructor(public servicio: ReporteInventarioService, private POST: postReporteInv, public cFunciones: Funciones,  private changeDetectorRef: ChangeDetectorRef
  ) {

    this.val.add("cmbTipoProd", "1", "LEN>", "0", "Producto", "Selecione un tipo Producto");
    this.val.add("cmbMoneda", "1", "LEN>", "0", "Producto", "Seleccione una Moneda");
    this.val.add("btn-check-delivery", "1", "LEN>=", "0", "", "");
    this.val.Get("btn-check-delivery").setValue(this.Delivery);
    this.val.Get("cmbTipoProd").setValue("0");
    this.val.Get("cmbMoneda").setValue(this.cFunciones.MonedaLocal);


  }

  public V_Confirmar(Exportar: boolean) {


    this.val.EsValido();
    this.Filtro1.val.EsValido();



    if (this.val.Errores != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
    }

    if (this.Filtro1.val.Errores != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.Filtro1.val.Errores,
      });

      return;
    }


    this.changeDetectorRef.detach(); // Detach change detection before the dialog opens. 


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

      this.changeDetectorRef.reattach(); // Reattach change detection after the dialog closes.


      if (dialogConfirmar.componentInstance.retorno == "1") {

        this.V_Imprimir(Exportar, "C")
      }




      if (dialogConfirmar.componentInstance.retorno == "0") {
        this.V_Imprimir(Exportar, "D")
      }

    });




  }



  private V_Imprimir(Exportar: boolean, TipoReporte: string): void {




    document.getElementById("btnImprimir-Reporte-Inv-ventas-por-proveedor")?.setAttribute("disabled", "disabled");

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
     d.Param = [this.Filtro1.val.Get("txtFecha1").value, this.Filtro1.val.Get("txtFecha2").value,
     this.Filtro1.val.Get("cmbBodega").value, this.Filtro1.val.Get("cmbProducto1").value[0], this.Filtro1.val.Get("cmbProducto2").value[0], this.Filtro2.val.Get("cmbProveedor").value[0],
     this.Filtro2.val.Get("cmbFamilia").value[0], this.Filtro2.val.Get("cmbSubFamilia").value[0], this.val.Get("cmbTipoProd").value, this.val.Get("cmbMoneda").value, this.Delivery, TipoReporte]
     d.TipoReporte = "Ventas Por Proveedor";
     d.Exportar = Exportar;


     let Bodegas: String = "";

     if (d.Param[2].length > 0) {
         Bodegas = ">";
         d.Param[2].forEach((e: any) => {
             Bodegas +=   e + "@";
         });
         
     }

    
     d.Param[0] = this.cFunciones.DateFormat(d.Param[0], "dd/MM/yyyy");
     d.Param[1] = this.cFunciones.DateFormat(d.Param[1], "dd/MM/yyyy");
     d.Param[2] = Bodegas;


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

          document.getElementById("btnImprimir-Reporte-Inv-ventas-por-proveedor")?.removeAttribute("disabled");

          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnImprimir-Reporte-Inv-ventas-por-proveedor")?.removeAttribute("disabled");


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


    this.val.Combo(this.Filtro1?.lstCmb);
    this.val.Combo(this.Filtro2?.lstCmb);

    ///CAMBIO DE FOCO
    this.Filtro1?.val.addFocus("txtFecha1", "txtFecha2", undefined);
    this.Filtro1?.val.addFocus("txtFecha2", "cmbBodega", undefined);
    this.Filtro1?.val.addFocus("cmbBodega", "cmbTipoProd", undefined);
    this.Filtro1?.val.addFocus("cmbTipoProd", "cmbMoneda", undefined);
    this.Filtro1?.val.addFocus("cmbMoneda", "cmbProducto1", undefined);
    this.Filtro1?.val.addFocus("cmbProducto1", "cmbProducto2", undefined);
    this.Filtro1?.val.addFocus("cmbProducto2", "cmbProveedor", undefined);
    this.Filtro1?.val.addFocus("cmbProveedor", "cmbFamilia", undefined);
    this.Filtro1?.val.addFocus("cmbFamilia", "cmbSubFamilia", undefined);
    this.Filtro1?.val.addFocus("cmbSubFamilia", "btnImprimir-Reporte-Inv-ventas-por-proveedor", "click");


  }


  private ngOnInit() {
    this.servicio.V_Iniciar();
  }
}

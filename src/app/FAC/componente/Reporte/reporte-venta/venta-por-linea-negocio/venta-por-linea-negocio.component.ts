import { Component, ViewChild} from '@angular/core';
import { ReporteVentaService } from 'src/app/FAC/Servicio/reporte-venta.service';
import { ReporteVentaFiltro1Component } from '../Filtros/reporte-venta-filtro-1/reporte-venta-filtro-1.component';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { ReporteInventarioFiltro1Component } from "../../../../../INV/componente/Reporte/reporte-inventario/Filtros/reporte-inventario-filtro-1/reporte-inventario-filtro-1.component";
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iParamReporte } from 'src/app/INV/Interface/I-Param-Reporte';
import { ReactiveFormsModule } from '@angular/forms';
import { postReporteVta } from 'src/app/FAC/POST/post-Reporte-Venta';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';

@Component({
  selector: 'app-venta-por-linea-negocio',
  standalone: true,
  imports: [ReporteInventarioFiltro1Component, ReporteVentaFiltro1Component, ReactiveFormsModule],
  templateUrl: './venta-por-linea-negocio.component.html',
  styleUrl: './venta-por-linea-negocio.component.scss'
})
export class VentaPorLineaNegocioComponent {
 

  @ViewChild("Filtro1", { static: false })
  public Filtro1: ReporteInventarioFiltro1Component;

  @ViewChild("Filtro2", { static: false })
  public Filtro2: ReporteVentaFiltro1Component;

  public val = new Validacion();

  public constructor(public servicio: ReporteVentaService, private cFunciones: Funciones, private POST : postReporteVta){
    this.val.add("cmbTipo", "1", "LEN>", "0", "", "Seleccione un tipo de reporte");

    this.val.SetValue("cmbTipo", "G");

    setTimeout(() => {
        this.Filtro2?.val.Get("cmbSubFamilia").disable();
        this.Filtro2?.val.Get("cmbPresupuesto").disable();
    
      }, 100);
    

    
    
  }


  public V_Select_Tipo(event: any) {


    this.Filtro2?.val.Get("cmbFamilia").disable();
    this.Filtro2?.val.Get("cmbSubFamilia").disable();
    this.Filtro2?.val.Get("cmbPresupuesto").disable();
 
    
    switch(event.target.value)
    {
        case "G":
            this.Filtro2?.val.Get("cmbFamilia").enable();
            break;
        case "SG":
            this.Filtro2?.val.Get("cmbSubFamilia").enable();
        break;
            case "P":
                this.Filtro2?.val.Get("cmbPresupuesto").enable();
        break;
    }
    
  }


  private ngAfterViewInit() {


    this.val.Combo(this.Filtro2?.lstCmb);

    ///CAMBIO DE FOCO
    this.Filtro1?.val.addFocus("txtFecha1", "txtFecha2", undefined);
    this.Filtro1?.val.addFocus("txtFecha2", "cmbTipo", undefined);
    this.Filtro1?.val.addFocus("cmbTipo", "cmbFamilia", undefined);
    this.Filtro2?.val.addFocus("cmbFamilia", "cmbSubFamilia", undefined);
    this.Filtro2?.val.addFocus("cmbSubFamilia", "cmbPresupuesto", undefined);
    this.Filtro2?.val.addFocus("cmbPresupuesto", "btnImprimir-Reporte-venta-linea-por-negocio", "click");


   
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


    document.getElementById("btnImprimir-Reporte-venta-linea-por-negocio")?.setAttribute("disabled", "disabled");

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

    let Codigo : string = "";

    switch(this.val.GetValue("cmbTipo"))
    {
        case "G":
            Codigo = this.Filtro2.val.GetValue("cmbFamilia");
            break;
        case "SG":
            Codigo = this.Filtro2.val.GetValue("cmbSubFamilia");
        break;
            case "P":
                Codigo = this.Filtro2.val.GetValue("cmbPresupuesto");
        break;
    }



    let d: iParamReporte = {} as iParamReporte;
    d.Param = [this.Filtro1.val.GetValue("txtFecha1"), this.Filtro1.val.GetValue("txtFecha2"), Codigo, this.val.GetValue("cmbTipo")];

    d.Param[0] = this.cFunciones.DateFormat(d.Param[0], "dd/MM/yyyy");
    d.Param[1] = this.cFunciones.DateFormat(d.Param[1], "dd/MM/yyyy");;

    d.TipoReporte = "VentasPorLinea";
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

                document.getElementById("btnImprimir-Reporte-venta-linea-por-negocio")?.removeAttribute("disabled");

                dialogRef.close();

                if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                    this.cFunciones.DIALOG.open(DialogErrorComponent, {
                        id: "error-servidor",
                        data: "<b class='error'>" + err.message + "</b>",
                    });
                }

            },
            complete: () => {
                document.getElementById("btnImprimir-Reporte-venta-linea-por-negocio")?.removeAttribute("disabled");

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



  private ngOnInit() {
    this.servicio.V_Iniciar();

  
  }
}

import { Component, ViewChild} from '@angular/core';
import { ReporteVentaService } from 'src/app/FAC/Servicio/reporte-venta.service';
import { ReporteVentaFiltro1Component } from '../Filtros/reporte-venta-filtro-1/reporte-venta-filtro-1.component';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { ReporteInventarioFiltro1Component } from "../../../../../INV/componente/Reporte/reporte-inventario/Filtros/reporte-inventario-filtro-1/reporte-inventario-filtro-1.component";
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iParamReporte } from 'src/app/INV/Interface/I-Param-Reporte';

@Component({
  selector: 'app-venta-por-linea-negocio',
  standalone: true,
  imports: [ReporteInventarioFiltro1Component, ReporteVentaFiltro1Component],
  templateUrl: './venta-por-linea-negocio.component.html',
  styleUrl: './venta-por-linea-negocio.component.scss'
})
export class VentaPorLineaNegocioComponent {
 

  @ViewChild("Filtro2", { static: false })
  public Filtro1: ReporteInventarioFiltro1Component;

  @ViewChild("Filtro2", { static: false })
  public Filtro2: ReporteVentaFiltro1Component;

  public val = new Validacion();

  public constructor(public servicio: ReporteVentaService, private cFunciones: Funciones,){}



  private ngAfterViewInit() {


    this.val.Combo(this.Filtro2?.lstCmb);

    ///CAMBIO DE FOCO
    this.Filtro2?.val.addFocus("cmbPresupuesto", "cmbFamilia", undefined);
    this.Filtro2?.val.addFocus("cmbFamilia", "cmbSubFamilia", undefined);
    this.Filtro2?.val.addFocus("cmbSubFamilia", "btnImprimir-Reporte-venta-linea-por-negocio", "click");


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

    let d: iParamReporte = {} as iParamReporte;
    d.Param = [this.Filtro1.val.Get("txtFecha1").value, this.Filtro1.val.Get("txtFecha2").value]

    d.Param[0] = this.cFunciones.DateFormat(d.Param[0], "dd/MM/yyyy");
    d.Param[1] = this.cFunciones.DateFormat(d.Param[1], "dd/MM/yyyy");;

    d.TipoReporte = "VentasPorLinea";
    d.Exportar = Exportar;
/*
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

*/
}



  private ngOnInit() {
    this.servicio.V_Iniciar();
  }
}

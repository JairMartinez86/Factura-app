import { Component } from '@angular/core';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { postReporteInv } from '../../POST/post-Reporte';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iParamReporte } from 'src/app/INV/Interface/I-Param-Reporte';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';

@Component({
  selector: 'app-reporte-inventario-transacc-enproceso',
  standalone: true,
  imports: [],
  templateUrl: './reporte-inventario-transacc-enproceso.component.html',
  styleUrl: './reporte-inventario-transacc-enproceso.component.scss'
})
export class ReporteInventarioTransaccEnprocesoComponent {


  
  constructor(private POST: postReporteInv, public cFunciones: Funciones
  ) {

  }

  
  public V_Imprimir(Exportar: boolean): void {
    document.getElementById("btnImprimir-Reporte-Inv-transac-proceso")?.setAttribute("disabled", "disabled");

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
   
    d.TipoReporte = "Transacciones En Proceso";
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

                document.getElementById("btnImprimir-Reporte-Inv-transac-proceso")?.removeAttribute("disabled");

                dialogRef.close();

                if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                    this.cFunciones.DIALOG.open(DialogErrorComponent, {
                        id: "error-servidor",
                        data: "<b class='error'>" + err.message + "</b>",
                    });
                }

            },
            complete: () => {
                document.getElementById("btnImprimir-Reporte-Inv-transac-proceso")?.removeAttribute("disabled");

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


}

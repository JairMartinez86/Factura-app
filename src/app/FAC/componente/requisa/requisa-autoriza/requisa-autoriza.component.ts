import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { getRequisa } from 'src/app/FAC/GET/get-requisa';
import { iRequisa } from 'src/app/FAC/interface/i-Requisa';
import { iRequisaDet } from 'src/app/FAC/interface/i-Requisa-Det';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';


@Component({
  selector: 'app-requisa-autoriza',
  templateUrl: './requisa-autoriza.component.html',
  styleUrl: './requisa-autoriza.component.scss'
})
export class RequisaAutorizaComponent {

  public val = new Validacion();
  public lstRequisa: MatTableDataSource<iRequisa>;


  displayedColumns: string[] = ["IdRequisa"];
  @ViewChild(MatPaginator) paginator: MatPaginator;



  constructor(public cFunciones: Funciones, private GET: getRequisa
  ) {

    this.val.add("txtBuscar", "1", "LEN>=", "0", "Buscar", "");

    this.V_CargarRequisa();

  }


  public V_CargarRequisa() {
    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    document.getElementById("btnRefrescarRequisa")?.setAttribute("disabled", "disabled");

    this.GET.GetRequisa(this.cFunciones.User).subscribe(
      (s) => {
        dialogRef.close();
        let _json = JSON.parse(s);

        if (_json["esError"] == 1) {
          this.cFunciones.DIALOG.open(DialogErrorComponent, {
            data: _json["msj"].Mensaje,
          });
        } else {
          let Datos: iDatos = _json["d"];


          this.lstRequisa = new MatTableDataSource(Datos.d);
          this.lstRequisa.paginator = this.paginator;
   

          document.getElementById("btnRefrescarRequisa")?.removeAttribute("disabled");

        }
      },
      (err) => {
        document.getElementById("btnRefrescarRequisa")?.removeAttribute("disabled");
        dialogRef.close();

        if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
          this.cFunciones.DIALOG.open(DialogErrorComponent, {
            id: "error-servidor",
            data: "<b class='error'>" + err.message + "</b>",
          });
        }
      }
    );
  }


  public V_Filtrar_Requisa(det: iRequisa): iRequisaDet[] {

    return det.RequisaDetalle;

  }


  public v_Filtrar(event: any)
  {
    this.lstRequisa.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }



  public V_AutorizarRequisa(det: iRequisa) {
    let dialogConfirmar: MatDialogRef<DialogoConfirmarComponent> = this.cFunciones.DIALOG.open(
      DialogoConfirmarComponent,
      {
        panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "escasan-dialog",
        disableClose: true
      }
    );

    dialogConfirmar.afterOpened().subscribe(s => {
      dialogConfirmar.componentInstance.textBoton1 = "Autorizar"
      dialogConfirmar.componentInstance.textBoton2 = "Cancelar";
      dialogConfirmar.componentInstance.SetMensajeHtml("<p><b style='color:red'>Autorizar la Requisa</b><br><b>No:</b> " + det.NoRequisa + " " + this.cFunciones.DateFormat(det.Fecha, "dd/MM/yyyy") + "<br><b>Bodega Origen:</b> " + det.CodBodega + "<br><b>Bodega Destino:</b> " + det.CodBodegaDestino + "</p>");
    });


    dialogConfirmar.afterClosed().subscribe(s => {

      if (dialogConfirmar.componentInstance.retorno == "1") {
        let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
          WaitComponent,
          {
            panelClass: "escasan-dialog-full-blur",
            data: "",
          }
        );



        this.GET.Autorizar(det.IdRequisa, this.cFunciones.User).subscribe(
          {
            next: (s) => {

              document.getElementById("btnAutorizar" + det.NoRequisa)?.removeAttribute("disabled");
           
              dialogRef.close();
              let _json = JSON.parse(s);

              if (_json["esError"] == 1) {
                if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
                  this.cFunciones.DIALOG.open(DialogErrorComponent, {
                    id: "error-servidor-msj",
                    data: _json["msj"].Mensaje,
                  });
                }
              }
              else {

                this.cFunciones.DIALOG.open(DialogErrorComponent, {
                  id: "error-servidor-msj",
                  data: _json["msj"].Mensaje,
                });

                this.V_CargarRequisa();
              }

            },
            error: (err) => {

              document.getElementById("btnAutorizar" + det.NoRequisa)?.removeAttribute("disabled");
  


              dialogRef.close();

              if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                this.cFunciones.DIALOG.open(DialogErrorComponent, {
                  id: "error-servidor",
                  data: "<b class='error'>" + err.message + "</b>",
                });
              }
            },
            complete: () => {

            }
          }
        );
      }
      else {
        this.V_CargarRequisa();
      }




    });
  }



}

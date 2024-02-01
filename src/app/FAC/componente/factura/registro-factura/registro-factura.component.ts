import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { getFactura } from 'src/app/FAC/GET/get-factura';
import { iFactPed } from 'src/app/FAC/interface/i-Factura-Pedido';
import { AnularComponent } from 'src/app/SHARED/anular/anular.component';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { FacturaComponent } from '../factura.component';
import * as printJS from 'print-js';
import { PDFDocument } from 'pdf-lib';
import { FactConfirmarComponent } from '../fact-confirmar/fact-confirmar.component';
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { ImprimirFacturaComponent } from './imprimir-factura/imprimir-factura.component';
import { FactLotificarComponent } from '../fact-lotificar/fact-lotificar.component';
import { postFactura } from 'src/app/FAC/POST/post-factura';
import { FactPagoComponent } from '../fact-pago/fact-pago.component';
import { iFacturaPagoCancelacion } from 'src/app/FAC/interface/i-Factura-Pago-Cancelacion';

let DatosImpresion: iDatos[];

@Component({
  selector: 'app-registro-factura',
  templateUrl: './registro-factura.component.html',
  styleUrls: ['./registro-factura.component.scss']
})
export class RegistroFacturaComponent {

  public val = new Validacion();
  displayedColumns: string[] = ["col1"];
  @ViewChild(MatPaginator) paginator: MatPaginator;


  public TipoDocumento: string;
  public EsCola: boolean = false;
  private Load : boolean = false;



  public lstDocumentos: MatTableDataSource<iFactPed[]>;

  constructor(
    private GET: getFactura,
    public cFunciones: Funciones,
    private POST: postFactura
  ) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Ingrese una fecha valida.");
    this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Fdinal", "Ingrese una fecha valida.");
    this.val.add("txtBuscar", "1", "LEN>=", "0", "Buscar", "");

    this.val.Get("txtFecha1").setValue(this.cFunciones.ShortFechaServidor());
    this.val.Get("txtFecha2").setValue(this.cFunciones.ShortFechaServidor());


  }

  public CargarDocumentos(): void {

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    document.getElementById("btnRefrescar")?.setAttribute("disabled", "disabled");

    this.GET.Get(this.val.Get("txtFecha1").value, this.val.Get("txtFecha2").value, this.TipoDocumento, this.EsCola).subscribe(
      (s) => {
        dialogRef.close();
        let _json = JSON.parse(s);

        if (_json["esError"] == 1) {
          this.cFunciones.DIALOG.open(DialogErrorComponent, {
            data: _json["msj"].Mensaje,
          });
        } else {
          let Datos: iDatos[] = _json["d"];


          this.lstDocumentos = new MatTableDataSource(Datos[0].d);
          this.lstDocumentos.paginator = this.paginator;

          //this.lstFilter = this.lstDocumentos.map((obj : any) => ({...obj}));
          document.getElementById("btnRefrescar")?.removeAttribute("disabled");

        }
      },
      (err) => {
        document.getElementById("btnRefrescar")?.removeAttribute("disabled");
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


  public v_Anular(det: any): void {

    let dialogRef: MatDialogRef<AnularComponent> = this.cFunciones.DIALOG.open(
      AnularComponent,
      {
        panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "escasan-dialog",
        disableClose: true
      }
    );

    dialogRef.afterOpened().subscribe(s => {
      this.Load = true;
      dialogRef.componentInstance.val.Get("txtNoDoc").setValue(det.TipoDocumento == "Factura" ? det.NoFactura : det.NoPedido);
      dialogRef.componentInstance.val.Get("txtSerie").setValue(det.Serie);
      dialogRef.componentInstance.val.Get("txtBodega").setValue(det.CodBodega);
      dialogRef.componentInstance.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(det.Fecha, "yyyy-MM-dd"));
      dialogRef.componentInstance.IdDoc = det.IdVenta;
      dialogRef.componentInstance.Tipo = det.TipoDocumento;
    });


    dialogRef.afterClosed().subscribe(s => {
      this.Load = false;
      this.CargarDocumentos();
    });


  }

  public v_Filtrar(event: any) {
    this.lstDocumentos.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }


  public v_Editar(det: iFactPed) {

    this.Load = true;


    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.GET.GetDetalle(det.IdVenta, this.cFunciones.User).subscribe(
      {
        next: (s) => {


          let _json = JSON.parse(s);

          if (_json["esError"] == 1) {
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });

              this.Load = false;
            }
          } else {
            let Datos: iDatos[] = _json["d"];


            det.VentaDetalle = Datos[0].d;


            let dialogRef: MatDialogRef<FacturaComponent> =
              this.cFunciones.DIALOG.open(FacturaComponent, {
                id: "dialog-factura-editar",
                panelClass: "escasan-dialog-full",
                disableClose: true
              });

            dialogRef.afterOpened().subscribe(s => {
              dialogRef.componentInstance.v_Editar(det, Datos[1].d);

            });

            dialogRef.afterClosed().subscribe(s => {
              this.CargarDocumentos();
              this.Load = false;
            });

          }

        },
        error: (err) => {
          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {
          dialogRef.close();
        }
      }
    );



  }

  public V_Imprimir(det: iFactPed, ImprimirProforma : boolean): void {
   
    if(det.TipoDocumento == "Proforma" || ImprimirProforma)
    {
      

      if(det.Correo != "")
      {
        let dialogRef: MatDialogRef<DialogoConfirmarComponent> =
        this.cFunciones.DIALOG.open(DialogoConfirmarComponent, {
          disableClose: true
        });
  
  
        dialogRef.afterOpened().subscribe(s => {
          this.Load = true;
          dialogRef.componentInstance.mensaje = "Enviar por Correo?";
          dialogRef.componentInstance.textBoton1 = "Si";
          dialogRef.componentInstance.textBoton2 = "No";
  
        });
  
  
  
        dialogRef.afterClosed().subscribe(s => {
  
          this.Load = false;
          if (dialogRef.componentInstance.retorno == "1") {
          
            this.V_ImprimirDOC(det, true, true);
          }
          else
          {
            this.V_ImprimirDOC(det, true, false);
          }
  
        });
  
      }
      else
      {
        this.V_ImprimirDOC(det, true, false);
      }
      
     


    }
    else
    {
      this.V_ImprimirDOC(det, false, false);
    }

  }

  private V_ImprimirDOC(det: iFactPed, ImprimirProforma : boolean, enviarCorreo : boolean)
  {

    
    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );
     
    this.GET.Imprimir(det.IdVenta, ImprimirProforma, enviarCorreo).subscribe(
      {
        next: (s) => {


          let _json = JSON.parse(s);

          if (_json["esError"] == 1) {
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          } else {


            let Datos: iDatos[] = _json["d"];

            if(det.TipoDocumento == "Proforma" || ImprimirProforma)
            {
              this.printPDFS(Datos[0].d);
              if(Datos[1].d != undefined)this.printPDFS(Datos[1].d);
              
            }

            
            this.CargarDocumentos();


          }

        },
        error: (err) => {
          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {
          dialogRef.close();
        }
      }
    );
  }


  public V_Pago(det: iFactPed) {

    this.Load = true;

    let dialogRefPago: MatDialogRef<FactPagoComponent> =
      this.cFunciones.DIALOG.open(FactPagoComponent, {
        panelClass: "escasan-dialog-full",
        data: [det.TotalCordoba, det.TotalDolar, det.TasaCambio, det.Fecha, det.IdFactura],
        disableClose: true
      });





    dialogRefPago.afterClosed().subscribe(s => {

      this.Load = false;
      if (dialogRefPago.componentInstance.Repuesta == 1) {
       this.CargarDocumentos();
      }

    });




  }
  public V_ConvertirFactura(det: iFactPed): void {

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.POST.ConvertirFactura(det).subscribe(
      {
        next: (s) => {


          let _json = JSON.parse(s);

          if (_json["esError"] == 1) {
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          } else {

            this.CargarDocumentos();

          }

        },
        error: (err) => {
          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {
          dialogRef.close();
        }
      }
    );

  }


  public V_Lotificar(det: iFactPed): void {



    if(det.TipoDocumento == "Proforma")
    {
      let Vence : Date = new Date(this.cFunciones.DateFormat(det.Vence, "yyyy-MM-dd"));

      let fServidor : Date = new Date(this.cFunciones.ShortFechaServidor());

      if(Vence < fServidor)
      {
        this.cFunciones.DIALOG.open(DialogErrorComponent, {
          id: "error-servidor-msj",
          data: "La Proforma se encuentra Vencida"
        });

        return;
      }
      
    }



    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.Load = true;
    this.GET.GetDetalle(det.IdVenta, this.cFunciones.User).subscribe(
      {
        next: (s) => {


          let _json = JSON.parse(s);

          if (_json["esError"] == 1) {
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });

              this.Load = false;
            }
          } else {
            let Datos: iDatos[] = _json["d"];


            if (Datos[1].d != "") {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                data: Datos[1].d,
              });
              this.Load = false;
              return;
              
            }

            

            det.VentaDetalle = Datos[0].d;



            let dialogRefLote: MatDialogRef<FactLotificarComponent> =
              this.cFunciones.DIALOG.open(FactLotificarComponent, {
                panelClass: "escasan-dialog-full",
                data: [det.CodBodega, det.VentaDetalle],
                disableClose: true
              });




            dialogRefLote.afterClosed().subscribe(s => {


              if (dialogRefLote.componentInstance.Repuesta == 1) {
                det.VentaDetalle = JSON.parse(JSON.stringify(dialogRefLote.componentInstance.lstDetalle.data));
                det.VentaLote = JSON.parse(JSON.stringify(dialogRefLote.componentInstance.lstLote));
                det.VentaLote.forEach(f => { f.Key = f.Key[0] });

                this.V_ConvertirFactura(det);
                this.Load = false;
              }

            });




          }

        },
        error: (err) => {
          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {
          dialogRef.close();
        }
      }
    );



  }





  /* Convert the merged pdf array buffer to blob url for print or open in browser.*/
  downloadFile(data: any) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    //window.open(url);
    printJS({
      printable: url,
      type: 'pdf',
      onPrintDialogClose: this.V_Mostrar_Manifiesto
    })

  }


  async printPDFS(datos: any) {

    if(datos == null) return;

    let byteArray = new Uint8Array(atob(datos).split('').map(char => char.charCodeAt(0)));

    var file = new Blob([byteArray], { type: 'application/pdf' });

    let url = URL.createObjectURL(file);

    let tabOrWindow : any = window.open(url, '_blank');
    tabOrWindow.focus();





  }



  public V_Mostrar_Manifiesto() {
    let byteArray = new Uint8Array(atob(DatosImpresion[1].d).split('').map(char => char.charCodeAt(0)));
    let file = new Blob([byteArray], { type: 'application/pdf' });
    let url = URL.createObjectURL(file);

    printJS({ printable: url, type: 'pdf', showModal: false, onPrintDialogClose: this.CargarDocumentos });


  }




  timeLeft: number = 1;
  interval : any;

  
  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
        history.pushState(null, '');
      } else {


        if(!this.Load) this.CargarDocumentos();

        this.timeLeft = 1;
      }
    },5000)
  }

  ngOnDestroy()
  {
    if(this.EsCola)clearInterval(this.interval);
  }

  private ngAfterViewInit() {


    if(this.EsCola)this.startTimer();

    ///CAMBIO DE FOCO
    this.val.addFocus("txtFecha1", "txtFecha2", undefined);
    this.val.addFocus("txtFecha2", "btnBuscarFactura", "click");

    this.CargarDocumentos();
  }



}







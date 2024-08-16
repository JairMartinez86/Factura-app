import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GlobalPositionStrategy, IgxComboComponent, IgxComboModule, IgxIconModule, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { getFactura } from '../../GET/get-factura';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { iCliente } from '../../interface/i-Cliente';
import { iProducto } from '../../interface/i-Producto';
import { iBodega } from '../../interface/i-Bodega';
import { CommonModule } from '@angular/common';
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { postFactura } from '../../POST/post-factura';
import { iLiberacionBonif } from '../../interface/i-Liberacion-Bonif';

@Component({
  selector: 'app-liberacion-bonificacion',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, MatPaginatorModule, MatTableModule, CommonModule],
  templateUrl: './liberacion-bonificacion.component.html',
  styleUrl: './liberacion-bonificacion.component.scss'
})
export class LiberacionBonificacionComponent {
  public val = new Validacion();
  public overlaySettings: OverlaySettings = {};


  displayedColumns: string[] = ["col1"];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  
  public lstLiberacionBonif: MatTableDataSource<iLiberacionBonif>;
  lstClientes: iCliente[] = [];
  lstProductos: iProducto[] = [];
  lstBodega: iBodega[] = [];


  @ViewChild("cmbProducto", { static: false })
  public cmbProducto: IgxComboComponent;

  @ViewChild("cmbCliente", { static: false })
  public cmbCliente: IgxComboComponent;

  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;

  @ViewChildren(IgxComboComponent)
  public cmbCombo: QueryList<IgxComboComponent>;


  constructor(
    public cFunciones: Funciones, private GET: getFactura, private POST: postFactura
  ) {

    this.val.add("cmbProducto", "1", "LEN>", "0", "Liberacion", "Seleccione al menos un producto.");
    this.val.add("cmbCliente", "1", "LEN>=", "0", "Liberacion", "Seleccione un cliente.");
    this.val.add("cmbBodega", "1", "LEN>=", "0", "Liberacion", "Seleccione una Bodega.");
    this.val.add("txtCantidad", "1", "NUM>", "0", "Liberacion", "Ingrese una cantidad.");

    this.V_Limpiar();
    this.V_CargarDatosLiberacion();
  }

  public V_Limpiar(): void {

    this.cmbProducto?.deselectAllItems();
    this.cmbCliente?.deselectAllItems();
    this.cmbBodega?.deselectAllItems();

    this.val.Get("txtCantidad").setValue("0");

  }



  public V_CargarDatosLiberacion(): void {
    document
      .getElementById("btnRefrescar-Liberacion-bonif")
      ?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );


    this.GET.GetDatosLiberacionBonif().subscribe(
      {
        next: (s) => {

          document.getElementById("btnRefrescar-Liberacion-bonif")?.removeAttribute("disabled");
          dialogRef.close();
          let _json = JSON.parse(s);
          this.cFunciones.ActualizarToken(_json["token"]);

          if (_json["esError"] == 1) {
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          } else {
            let Datos: iDatos[] = _json["d"];

            this.lstProductos = Datos[0].d;
            this.lstClientes = Datos[1].d;
            this.lstBodega = Datos[2].d;
            this.lstLiberacionBonif = new MatTableDataSource(Datos[3].d);
            this.lstLiberacionBonif.paginator = this.paginator;


          }

        },
        error: (err) => {
          document.getElementById("btnRefrescar-Liberacion-bonif")?.removeAttribute("disabled");
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



  public v_Select_Producto(event: any): void {
    this.val.Get("cmbProducto").setValue("");

    if (event.added.length) {
      this.val.Get("cmbProducto").setValue(event.newValue);

    }
  }

  public v_Enter_Producto(event: any) {

    if (event.key == "Enter") {
      let cmb: any = this.cmbProducto.dropdown;
      let _Item: iProducto = cmb._focusedItem.value;
      this.cmbProducto.select([_Item.Codigo]);

    }
  }




  public v_Select_Cliente(event: any): void {
    this.val.Get("cmbCliente").setValue("");

    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);

      this.val.Get("cmbCliente").setValue(event.newValue[0]);
      this.cmbCliente.close();

    }
  }

  public v_Enter_Cliente(event: any) {

    if (event.key == "Enter") {
      let cmb: any = this.cmbCliente.dropdown;
      let _Item: iCliente = cmb._focusedItem.value;
      this.cmbCliente.select([_Item.Codigo]);
      this.cmbCliente.close();
    }
  }



  public v_Select_Bodega(event: any): void {
    this.val.Get("cmbBodega").setValue("");

    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);

      this.val.Get("cmbBodega").setValue(event.newValue[0]);
      this.cmbBodega.close();

    }
  }

  public v_Enter_Bodega(event: any) {

    if (event.key == "Enter") {
      let cmb: any = this.cmbBodega.dropdown;
      let _Item: iBodega = cmb._focusedItem.value;
      this.cmbBodega.select([_Item.Codigo]);
      this.cmbBodega.close();
    }
  }


  public v_minus_mas(s: string): void {

    let valor: string = this.val.Get("txtCantidad").value;

    if (valor == "" || valor == undefined) valor = "0";

    let num: number = Number(valor.replaceAll(",", ""))

    if (s == "+") num += 1;

    if (s == "-") num -= 1;

    this.val.Get("txtCantidad").setValue(this.cFunciones.NumFormat(num, "0"));


  }

  public V_Productos_Seleccionados(): any {
    if (this.val?.Get("cmbProducto")?.value == undefined) return []
    let Prod: string[] = this.val?.Get("cmbProducto")?.value;

    return this.lstProductos.filter(f => Prod.includes(f.Codigo));
  }





  public V_Guardar(): void {


    this.val.EsValido();

    let Prod: string[] = this.val?.Get("cmbProducto")?.value;
    



    if (this.val.Errores != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
    }

    if (Prod.length == 0) return;



    let Bodega: iBodega = this.lstBodega.find(f => f.Codigo == this.val.Get("cmbBodega").value)!;
    let Cliente: iCliente = this.lstClientes.find(f => f.Codigo == this.val.Get("cmbCliente").value)!;

    let Liberados: iLiberacionBonif[] = [];


    let Productos: string = "<ul>";
    let x: number = 1;
    this.lstProductos.filter(f => Prod.includes(f.Codigo)).forEach(f => {

      let l: iLiberacionBonif = {} as iLiberacionBonif;
      l.IdLiberarBonificacion = -1;
      l.IdBodega = Bodega?.IdBodega;
      l.Bodega = this.val.Get("cmbBodega").value[0];
      l.IdCliente = Cliente?.IdCliente;
      l.Cliente = this.val.Get("cmbCliente").value[0];
      l.IdProducto = f.IdProducto;
      l.Producto = f.Codigo;
      l.CantMax = this.val.Get("txtCantidad").value;
      l.Activo = true;
      l.Usuario = this.cFunciones.User;
      Liberados.push(l);

      Productos += "<li>" + x + ". " + f.Codigo + " - " + f.Producto + "</li>";
      x++;




    });

    Productos += "</ul>";


    let dialogConfirmar: MatDialogRef<DialogoConfirmarComponent> = this.cFunciones.DIALOG.open(
      DialogoConfirmarComponent,
      {
        panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "escasan-dialog",
        disableClose: true
      }
    );

    dialogConfirmar.afterOpened().subscribe(s => {
      dialogConfirmar.componentInstance.Set_StyleBtn1("width:180px");
      dialogConfirmar.componentInstance.textBoton1 = "Liberar Bonificacion"
      dialogConfirmar.componentInstance.textBoton2 = "Cancelar";
      dialogConfirmar.componentInstance.SetMensajeHtml("<p><b style='color:red'>Esta seguro de liberar la bonificacion de los siguienes productos:</b>" + Productos + "</p>");
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









        this.POST.LiberarBonificacion(Liberados).subscribe(
          {
            next: (s) => {


              dialogRef.close();
              let _json = JSON.parse(s);
              this.cFunciones.ActualizarToken(_json["token"]);

              if (_json["esError"] == 1) {
                if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
                  this.cFunciones.DIALOG.open(DialogErrorComponent, {
                    id: "error-servidor-msj",
                    data: _json["msj"].Mensaje,
                  });
                }
              }
              else {

                let Datos: iDatos = _json["d"];



                this.cFunciones.DIALOG.open(DialogErrorComponent, {
                  id: "error-servidor-msj",
                  data: Datos.d,
                });


                this.V_Limpiar();
                this.V_CargarDatosLiberacion();
              }

            },
            error: (err) => {

              document.getElementById("liberar-inventario-bonif")?.removeAttribute("disabled");



              dialogRef.close();

              if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                this.cFunciones.DIALOG.open(DialogErrorComponent, {
                  id: "error-servidor",
                  data: "<b class='error'>" + err.message + "</b>",
                });
              }
            },
            complete: () => {
              document.getElementById("liberar-inventario-bonif")?.removeAttribute("disabled");

            }
          }
        );
      }


    });
  }

  public V_Anular(det : any)
  {
    
    let dialogConfirmar: MatDialogRef<DialogoConfirmarComponent> = this.cFunciones.DIALOG.open(
      DialogoConfirmarComponent,
      {
        panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "escasan-dialog",
        disableClose: true
      }
    );

    dialogConfirmar.afterOpened().subscribe(s => {
      dialogConfirmar.componentInstance.textBoton1 = "Si"
      dialogConfirmar.componentInstance.textBoton2 = "Cancelar";
      dialogConfirmar.componentInstance.SetMensajeHtml("<p><b style='color:red'>Esta seguro anular la liberacion:</b><br>" + det.Producto + "</p>");
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


      let Liberados: iLiberacionBonif[] = [];
      det.Activo = false;
      det.Usuario = this.cFunciones.User;
      Liberados.push(det);



        this.POST.LiberarBonificacion(Liberados).subscribe(
          {
            next: (s) => {


              dialogRef.close();
              let _json = JSON.parse(s);
              this.cFunciones.ActualizarToken(_json["token"]);

              if (_json["esError"] == 1) {
                if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
                  this.cFunciones.DIALOG.open(DialogErrorComponent, {
                    id: "error-servidor-msj",
                    data: _json["msj"].Mensaje,
                  });
                }
              }
              else {

               let Datos: iDatos = _json["d"];



                this.cFunciones.DIALOG.open(DialogErrorComponent, {
                  id: "error-servidor-msj",
                  data: Datos.d,
                });

                this.V_CargarDatosLiberacion();
              }

            },
            error: (err) => {

              document.getElementById("liberar-inventario-bonif")?.removeAttribute("disabled");



              dialogRef.close();

              if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
                this.cFunciones.DIALOG.open(DialogErrorComponent, {
                  id: "error-servidor",
                  data: "<b class='error'>" + err.message + "</b>",
                });
              }
            },
            complete: () => {
              document.getElementById("liberar-inventario-bonif")?.removeAttribute("disabled");

            }
          }
        );
      }


    });
  }


  public v_Filtrar(event: any) {
    this.lstLiberacionBonif.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }




  ngDoCheck() {



    ///CAMBIO DE FOCO
    this.val.Combo(this.cmbCombo);
    this.val.addFocus("cmbProducto", "txtCantidad", undefined);
    this.val.addFocus("txtCantidad", "cmbCliente", undefined);
    this.val.addFocus("cmbCliente", "cmbBodeba", undefined);
    this.val.addFocus("cmbBodeba", "txtCantidad", undefined);
    this.val.addFocus("txtCantidad", "btnGuardar-liberacion-bonif", "click");

    this.val.addNumberFocus("txtCantidad", 0);

    this.overlaySettings = {};

    if (window.innerWidth <= this.cFunciones.TamanoPantalla("md")) {
      this.overlaySettings = {
        positionStrategy: new GlobalPositionStrategy({ openAnimation: scaleInCenter, closeAnimation: scaleOutCenter }),
        modal: true,
        closeOnOutsideClick: true
      };
    }

  }


  private ngOnInit() {





  }
}

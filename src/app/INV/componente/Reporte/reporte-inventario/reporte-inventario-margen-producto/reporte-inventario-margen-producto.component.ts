import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalPositionStrategy, IgxCardModule, IgxComboComponent, IgxComboModule, IgxDatePickerModule, IgxIconModule, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { CommonModule } from '@angular/common';
import { iProducto } from 'src/app/FAC/interface/i-Producto';
import { iBodega } from 'src/app/FAC/interface/i-Bodega';
import { ReporteInventarioService } from 'src/app/INV/Servicio/reporte-inventario.service';
import { iReporteService } from 'src/app/INV/Interface/i-Reporte-Service';
import { postReporteInv } from '../../POST/post-Reporte';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iParamReporte } from 'src/app/INV/Interface/I-Param-Reporte';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';


@Component({
  selector: 'app-reporte-inventario-margen-producto',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule, IgxCardModule, IgxDatePickerModule],
  templateUrl: './reporte-inventario-margen-producto.component.html',
  styleUrl: './reporte-inventario-margen-producto.component.scss'
})
export class ReporteInventarioMargenProductoComponent {

  public val = new Validacion();

  @ViewChild("cmbProducto1", { static: false })
  public cmbProducto1: IgxComboComponent;

  @ViewChild("cmbProducto2", { static: false })
  public cmbProducto2: IgxComboComponent;

  lstProductos1: iProducto[] = [];
  lstProductos2: iProducto[] = [];

  private DatosFiltro : iReporteService;

  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;


  constructor(public servicio: ReporteInventarioService, private POST: postReporteInv, public cFunciones: Funciones
  ) {
    this.val.add("cmbProducto1", "1", "LEN>=", "0", "Producto", "Seleccione");
    this.val.add("cmbProducto2", "1", "LEN>=", "0", "Producto", "Seleccione");
    

    this.val.Get("cmbProducto1").setValue("");
    this.val.Get("cmbProducto2").setValue("");
    this.servicio.V_Iniciar();
  }


  public v_Select_Producto1(event: any): void {
    
    this.val.replace("cmbProducto2", "1", "LEN>=", "0", "");

    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);

      this.val.Get("cmbProducto1").setValue(event.newValue[0]);
      this.cmbProducto1.close();

      this.val.replace("cmbProducto2", "1", "LEN>", "0", "Seleccione el producto final");

    }
  }

  public V_Enter_Producto1(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbProducto1.dropdown;
      let _Item: iProducto = cmb._focusedItem?.value;
      this.cmbProducto1.setSelectedItem(_Item?.Codigo);
      this.val.Get("cmbProducto1").setValue([_Item?.Codigo]);

    }
  }



  public v_Select_Producto2(event: any): void {
    
    this.val.replace("cmbProducto1", "1", "LEN>=", "0", "");

    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);

      this.val.Get("cmbProducto2").setValue(event.newValue[0]);
      this.cmbProducto2.close();

      this.val.replace("cmbProducto1", "1", "LEN>", "0", "Seleccione el primer producto");

    }
  }


  public V_Enter_Producto2(event: any) {


    if (event.key == "Enter") {
      let cmb: any = this.cmbProducto2.dropdown;
      let _Item: iProducto = cmb._focusedItem?.value;
      this.cmbProducto2.setSelectedItem(_Item?.Codigo);
      this.val.Get("cmbProducto2").setValue([_Item?.Codigo]);

    }
  }


  public V_Imprimir(Exportar: boolean): void {




    this.val.EsValido();


    if (this.val.Errores != "") {

      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data:
          "<ul>" + this.val.Errores + "</ul>",
      });
      return;

    }




    document.getElementById("btnImprimir-Reporte-Inv-ventas-margen-producto")?.setAttribute("disabled", "disabled");

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
    d.Param = [this.val.Get("cmbProducto1").value[0], this.val.Get("cmbProducto2").value[0]]
    d.TipoReporte = "Margen Producto";
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

          document.getElementById("btnImprimir-Reporte-Inv-ventas-margen-producto")?.removeAttribute("disabled");

          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => {
          document.getElementById("btnImprimir-Reporte-Inv-ventas-margen-producto")?.removeAttribute("disabled");

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


    this.val.Combo(this?.lstCmb);
    ///CAMBIO DE FOCO
    this?.val.addFocus("cmbProducto1", "cmbProducto2", undefined);
    this?.val.addFocus("cmbProducto2", "btnImprimir-Reporte-Inv-ventas-margen-producto", "click");


  }

  
  private ngOnInit() {
    this.servicio.Salida.subscribe((result: iReporteService[]) => {

       let d : iReporteService = result.find(f => f.Filtro == "Filtro2")!;

       if(d == undefined) return;
       
       this.DatosFiltro = d;
       this.lstProductos1 = d.Datos[1];
       this.lstProductos2 = d.Datos[1];
  
    },
      (error: any) => {
        // Errors
      },
      () => {

        // 'onCompleted' callback.
        // No errors, route to new page here
      });




      this.servicio.Filtro.subscribe(result => {
    
        if(result[0] == "FILTRO_PRODUCTO")
        {

           let p : iProducto[] = this.DatosFiltro.Datos[1].filter((f : any) => f.IdGrupoPresupuestario == (result[1] == "" ? f.IdGrupoPresupuestario : result[1]) && f.CodProveedorEscasan == (result[2] == "" ? f.CodProveedorEscasan : result[2]) && f.IdGrupo == (result[3] == "" ? f.IdGrupo : result[3])  && f.IdSubGrupo == (result[4] == "" ? f.IdSubGrupo : result[4]));
           this.lstProductos1 = p;
           this.lstProductos2 = p;

           this.cmbProducto1.deselectAllItems();
           this.cmbProducto2.deselectAllItems();
         

           this.val.Get("cmbProducto1").setValue([]);
           this.val.Get("cmbProducto2").setValue([]);


        }

   
     },
       (error: any) => {
         // Errors
       },
       () => {
 
         // 'onCompleted' callback.
         // No errors, route to new page here
       })
  }

}

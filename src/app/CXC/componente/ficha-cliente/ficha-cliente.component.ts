import { Component, QueryList, ViewChild, ViewChildren,  } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalPositionStrategy, IgxCardModule, IgxComboComponent, IgxComboModule, IgxIconModule, OverlaySettings } from 'igniteui-angular';
import { CommonModule } from '@angular/common';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { iVendedor } from 'src/app/FAC/interface/i-venedor';
import { iBodega } from 'src/app/FAC/interface/i-Bodega';
import { iFichaCliente } from '../../interface/i-ficha-cliente';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { MatDialogRef } from '@angular/material/dialog';
import { postEstadoCuenta } from '../../CRUD/post-estado-cuenta';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';


@Component({
  selector: 'app-ficha-cliente',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule, IgxCardModule ],
  templateUrl: './ficha-cliente.component.html',
  styleUrl: './ficha-cliente.component.scss'
})
export class FichaClienteComponent {
  public val = new Validacion();
  public overlaySettings: OverlaySettings = {};

  @ViewChild("cmbVendedor", { static: false })
  public cmbVendedor: IgxComboComponent;

  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;
  public BodSeleccionadas : iBodega[];
  lstBodega: iBodega[] = [];

  @ViewChild("cmbListaPrecio", { static: false })
  public cmbListaPrecio: IgxComboComponent;


  lstVendedores: iVendedor[] = [];
  lstConceptoPrecio : any[] = [];

  public SimboloMoneda : string = "";
  public DatosCliente: iFichaCliente = {} as iFichaCliente;

  
  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;
  

  public constructor(public cFunciones: Funciones, private POST : postEstadoCuenta) {

    this.val.add("cmbMoneda", "1", "LEN>", "0", "Cliente", "Seleccione una moneda.");
    this.val.add("cmbListaPrecio", "1", "LEN>", "0", "Cliente", "Seleccione una lista de precio.");
    this.val.add("txtLimite", "1", "NUM>=", "0", "Cliente", "Ingrese un limite valido.");
    this.val.add("txtPlazo", "1", "NUM>=", "0", "Cliente", "Ingrese un plazo valido.");
    this.val.add("cmbVendedor", "1", "LEN>", "0", "Cliente", "Seleccione un vendedor.");
    this.val.add("cmbEstado", "1", "LEN>", "0", "Cliente", "Seleccione un estado.");
    this.val.add("cmbBodega", "1", "LEN>=", "0", "Cliente", "Seleccione una Bodega.");
    this.val.add("chk-supendido-moroso", "1", "LEN>=", "0", "Cliente", "");
    this.val.add("chk-confianza-siempre", "1", "LEN>=", "0", "Cliente", "");
    this.val.add("chk-confianza-vencido", "1", "LEN>=", "0", "Cliente", "");
    this.val.add("chk-confianza-una-vez", "1", "LEN>=", "0", "Cliente", "");
    this.val.add("chk-cuenta-clave", "1", "LEN>=", "0", "Cliente", "");

    this.val.Get("cmbBodega").disable();

    
    
  }

  public v_Enter_ConceptoPrecio(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbListaPrecio.dropdown;
      let _Item: any = cmb._focusedItem.value;
      this.cmbVendedor.setSelectedItem(_Item.IdConceptoPrecio);
      this.val.Get("cmbListaPrecio").setValue([_Item.IdConceptoPrecio]);
    }
  }



  public v_Enter_Vendedor(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbVendedor.dropdown;
      let _Item: iVendedor = cmb._focusedItem.value;
      this.cmbVendedor.setSelectedItem(_Item.Codigo);
      this.val.Get("cmbVendedor").setValue([_Item.Codigo]);
    }
  }


  public V_Select_Bodega(event: any) {

    if (event.added.length) {
      let cmb: any = this.cmbBodega.dropdown;
      this.val.Get("cmbBodega").setValue(event.newValue);
      this.val.Get("cmbBodega").enable();
      
     
    }

    this.BodSeleccionadas = this.lstBodega.filter((e: iBodega) => event.newValue.indexOf(e.Codigo) > -1);
  }



  public V_Enter_Bodega(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbBodega.dropdown;
      let _Item: iBodega = cmb._focusedItem?.value;
      this.cmbBodega.setSelectedItem(_Item?.Codigo);
      this.val.Get("cmbBodega").setValue([_Item?.Codigo]);

    }
  }

  public v_Activar_Bodega(e : any){
    this.val.Get("cmbBodega").disable();
    if(e.checked) this.val.Get("cmbBodega").enable();
    if(!e.checked) this.cmbBodega.deselectAllItems();
  }


  public V_Guardar(){

    this.val.EsValido();


    
    if (this.val.Errores != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.val.Errores ,
      });

      return;
    }


    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );


    document.getElementById("btn-Guardar-Permiso-Cartera")?.setAttribute("disabled", "disabled");

    this.DatosCliente.IdConceptoPrecio = this.DatosCliente.IdConceptoPrecio[0];
    this.DatosCliente.CodVendedor = this.DatosCliente.CodVendedor[0];
    this.DatosCliente.Limite = Number(String(this.DatosCliente.Limite).replaceAll(",", ""));
    
    this.POST.GuardarPermiso(this.DatosCliente).subscribe(
      {
        next: (s) => {

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


            let Datos: iDatos = _json["d"];

            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "servidor-msj",
              data: Datos.d,
            });


  

  

          }

        },
        error: (err) => {
          dialogRef.close();

          
          document.getElementById("btn-Guardar-Permiso-Cartera")?.removeAttribute("disabled");

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {

          document.getElementById("btn-Guardar-Permiso-Cartera")?.removeAttribute("disabled");
        }
      }
    );

    this.V_RefrescarFormato();

  }

  public V_RefrescarFormato(){
    this.DatosCliente.Limite = this.cFunciones.NumFormat(this.DatosCliente.Limite, "2" )
  }

  
  ngDoCheck() {

    this.val.Combo(this.lstCmb);



  }


  ngAfterViewInit(): void {
    ///CAMBIO DE FOCO
    this.val.addFocus("cmbMoneda", "txtLimite", undefined);
    this.val.addFocus("txtLimite", "cmbListaPrecio", undefined);
    this.val.addFocus("cmbListaPrecio", "txtPlazo", undefined);
    this.val.addFocus("txtPlazo", "cmbEstado", undefined);
    this.val.addFocus("cmbEstado", "btn-Guardar-Permiso-Cartera", undefined);

    this.val.addNumberFocus("txtLimite", 2);
    this.val.addNumberFocus("txtPlazo", 2);


  }

  
  ngOnInit(): void {


    this.overlaySettings = {};

    if (window.innerWidth <= 992) {
      this.overlaySettings = {
        positionStrategy: new GlobalPositionStrategy({ openAnimation: scaleInCenter, closeAnimation: scaleOutCenter }),
        modal: true,
        closeOnOutsideClick: true
      };
    }

  }


  
}

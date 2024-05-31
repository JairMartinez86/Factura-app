import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalPositionStrategy, IgxComboComponent, IgxComboModule, IgxIconModule, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { CommonModule } from '@angular/common';
import { iProducto } from 'src/app/FAC/interface/i-Producto';
import { iBodega } from 'src/app/FAC/interface/i-Bodega';

@Component({
  selector: 'app-reporte-inventario-filtro-2',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './reporte-inventario-filtro-2.component.html',
  styleUrl: './reporte-inventario-filtro-2.component.scss'
})
export class ReporteInventarioFiltro2Component {
  public val = new Validacion();

  lstBodega: iBodega[] = [];
  lstProductos: iProducto[] = [];

  public overlaySettings: OverlaySettings = {};

  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;


  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;


  @ViewChild("cmbProducto1", { static: false })
  public cmbProducto1: IgxComboComponent;

  @ViewChild("cmbProducto2", { static: false })
  public cmbProducto2: IgxComboComponent;

  
  constructor(public cFunciones: Funciones) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Ingrese una fecha valida.");
    this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Fdinal", "Ingrese una fecha valida.");
    this.val.add("cmbBodega", "1", "LEN>=", "0", "", "");
    this.val.add("cmbProducto1", "1", "LEN>=", "0", "", "");
    this.val.add("cmbProducto2", "1", "LEN>=", "0", "", "");

    this.val.Get("txtFecha1").setValue(this.cFunciones.ShortFechaServidor());
    this.val.Get("txtFecha2").setValue(this.cFunciones.ShortFechaServidor());


  }
  

  
  public V_Select_Bodega(event: any) {
    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      let cmb : any = this.cmbBodega.dropdown;
      this.val.Get("cmbBodega").setValue(event.newValue[0]);
      this.cmbBodega.close();
    }
  }

  public V_Enter_Bodega(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbBodega.dropdown;
      let _Item: iBodega = cmb._focusedItem.value;
      this.cmbBodega.setSelectedItem(_Item.Codigo);
      this.val.Get("cmbBodega").setValue([_Item.Codigo]);

    }
  }




  ngDoCheck() {

    if (this.cmbBodega != undefined) this.cmbBodega.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";
    if (this.cmbProducto1 != undefined) this.cmbProducto1.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";
    if (this.cmbProducto2 != undefined) this.cmbProducto2.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";



    this.overlaySettings = {};

    if (window.innerWidth <= 992) {
      this.overlaySettings = {
        positionStrategy: new GlobalPositionStrategy({ openAnimation: scaleInCenter, closeAnimation: scaleOutCenter }),
        modal: true,
        closeOnOutsideClick: true
      };
    }

  }


  private ngAfterViewInit() {


    this.val.Combo(this.lstCmb);

      ///CAMBIO DE FOCO
      this.val.addFocus("txtFecha1", "txtFecha2", undefined);
      this.val.addFocus("txtFecha2", "cmbBodega", undefined);
      this.val.addFocus("cmbProducto1", "cmbProducto2", undefined);
      this.val.addFocus("cmbProducto2", "btnImprimir", "click");
  
    
  }

}

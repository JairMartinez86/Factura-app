import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalPositionStrategy, IgxComboComponent, IgxComboModule, IgxIconModule, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporte-inventario-filtro-4',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './reporte-inventario-filtro-4.component.html',
  styleUrl: './reporte-inventario-filtro-4.component.scss'
})
export class ReporteInventarioFiltro4Component {

  public val = new Validacion();
  lstGrupo: any[] = [];
  lstProveedor: any[] = [];
  lstFamilia: any[] = [];
  lstSubFamilia: any[] = [];

  public overlaySettings: OverlaySettings = {};

  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;


  @ViewChild("cmbPresupuesto", { static: false })
  public cmbPresupuesto: IgxComboComponent;


  @ViewChild("cmbProveedor", { static: false })
  public cmbProveedor: IgxComboComponent;


  @ViewChild("cmbFamilia", { static: false })
  public cmbFamilia: IgxComboComponent;


  @ViewChild("cmbSubFamilia", { static: false })
  public cmbSubFamilia: IgxComboComponent;


  constructor(public cFunciones: Funciones) {

    this.val.add("cmbPresupuesto", "1", "LEN>=", "0", "", "");
    this.val.add("cmbProveedor", "1", "LEN>=", "0", "", "");
    this.val.add("cmbFamilia", "1", "LEN>=", "0", "", "");
    this.val.add("cmbSubFamilia", "1", "LEN>=", "0", "", "");

  }
  

  public V_Select_Presupuesto(event: any) {
    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      let cmb : any = this.cmbPresupuesto.dropdown;
      this.val.Get("cmbPresupuesto").setValue(event.newValue[0]);
      this.cmbPresupuesto.close();
    }
  }

  public V_Enter_Presupuesto(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbPresupuesto.dropdown;
      let _Item: any = cmb._focusedItem.value;
      this.cmbPresupuesto.setSelectedItem(_Item.Codigo);
      this.val.Get("cmbPresupuesto").setValue([_Item.Codigo]);

    }
  }




  
  public V_Select_Proveedor(event: any) {
    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      let cmb : any = this.cmbProveedor.dropdown;
      this.val.Get("cmbProveedor").setValue(event.newValue[0]);
      this.cmbProveedor.close();
    }
  }

  public V_Enter_Proveedor(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbProveedor.dropdown;
      let _Item: any = cmb._focusedItem.value;
      this.cmbProveedor.setSelectedItem(_Item.Codigo);
      this.val.Get("cmbProveedor").setValue([_Item.Codigo]);

    }
  }



  
  public V_Select_Familia(event: any) {
    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      let cmb : any = this.cmbFamilia.dropdown;
      this.val.Get("cmbFamilia").setValue(event.newValue[0]);
      this.cmbFamilia.close();
    }
  }

  public V_Enter_Familia(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbFamilia.dropdown;
      let _Item: any = cmb._focusedItem.value;
      this.cmbFamilia.setSelectedItem(_Item.Codigo);
      this.val.Get("cmbFamilia").setValue([_Item.Codigo]);

    }
  }


    
  public V_Select_SubFamilia(event: any) {
    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      let cmb : any = this.cmbSubFamilia.dropdown;
      this.val.Get("cmbSubFamilia").setValue(event.newValue[0]);
      this.cmbSubFamilia.close();
    }
  }

  public V_Enter_SubFamilia(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbSubFamilia.dropdown;
      let _Item: any = cmb._focusedItem.value;
      this.cmbSubFamilia.setSelectedItem(_Item.Codigo);
      this.val.Get("cmbSubFamilia").setValue([_Item.Codigo]);

    }
  }



  
  ngDoCheck() {

    if (this.cmbPresupuesto != undefined) this.cmbPresupuesto.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";
    if (this.cmbProveedor != undefined) this.cmbProveedor.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";
    if (this.cmbFamilia != undefined) this.cmbFamilia.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";
    if (this.cmbSubFamilia != undefined) this.cmbSubFamilia.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";



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
      this.val.addFocus("cmbPresupuesto", "cmbProveedor", undefined);
      this.val.addFocus("cmbFamilia", "cmbSubFamilia", undefined);
      this.val.addFocus("cmbSubFamilia", "btnImprimir", "click");
  
    
  }



}

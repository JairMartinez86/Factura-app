import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalPositionStrategy, IgxComboComponent, IgxComboModule, IgxIconModule, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { CommonModule } from '@angular/common';
import { iSerie } from 'src/app/FAC/interface/i-Serie';

@Component({
  selector: 'app-reporte-inventario-filtro-3',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './reporte-inventario-filtro-3.component.html',
  styleUrl: './reporte-inventario-filtro-3.component.scss'
})
export class ReporteInventarioFiltro3Component {
  public val = new Validacion();
  lstSerie: iSerie[] = [];

  public overlaySettings: OverlaySettings = {};

  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;


  @ViewChild("cmbSerie", { static: false })
  public cmbSerie: IgxComboComponent;




  
  constructor(public cFunciones: Funciones) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Ingrese una fecha valida.");
    this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Fdinal", "Ingrese una fecha valida.");
    this.val.add("cmbSerie", "1", "LEN>=", "0", "", "");


    this.val.Get("txtFecha1").setValue(this.cFunciones.ShortFechaServidor());
    this.val.Get("txtFecha2").setValue(this.cFunciones.ShortFechaServidor());


  }
  

  public V_Select_Serie(event: any) {
    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      let cmb : any = this.cmbSerie.dropdown;
      this.val.Get("cmbSerie").setValue(event.newValue[0]);
      this.cmbSerie.close();
    }
  }

  public V_Enter_Serie(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbSerie.dropdown;
      let _Item: iSerie = cmb._focusedItem.value;
      this.cmbSerie.setSelectedItem(_Item.IdSerie);
      this.val.Get("cmbSerie").setValue([_Item.IdSerie]);

    }
  }


  
  ngDoCheck() {

    if (this.cmbSerie != undefined) this.cmbSerie.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";


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
      this.val.addFocus("txtFecha2", "cmbSerie", undefined);
      this.val.addFocus("cmbSerie", "btnImprimir", "click");
  
    
  }
}

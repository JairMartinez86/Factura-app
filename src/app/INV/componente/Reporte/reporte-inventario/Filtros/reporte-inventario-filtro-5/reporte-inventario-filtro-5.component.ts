import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalPositionStrategy, IgxComboComponent, IgxComboModule, IgxIconModule, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { CommonModule } from '@angular/common';
import { iReporteService } from 'src/app/INV/Interface/i-Reporte-Service';
import { ReporteInventarioService } from 'src/app/INV/Servicio/reporte-inventario.service';

@Component({
  selector: 'app-reporte-inventario-filtro-5',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './reporte-inventario-filtro-5.component.html',
  styleUrl: './reporte-inventario-filtro-5.component.scss'
})
export class ReporteInventarioFiltro5Component {
  public val = new Validacion();
  lstGrupoPre: any[] = [];
  lstFamilia: any[] = [];

  public overlaySettings: OverlaySettings = {};

  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;


  @ViewChild("cmbPresupuesto", { static: false })
  public cmbPresupuesto: IgxComboComponent;


  @ViewChild("cmbFamilia", { static: false })
  public cmbFamilia: IgxComboComponent;

  private DatosFiltro : iReporteService;


  constructor(public cFunciones: Funciones, public servicio: ReporteInventarioService) {

    this.val.add("cmbPresupuesto", "1", "LEN>=", "0", "", "");
    this.val.add("cmbFamilia", "1", "LEN>=", "0", "", "");

    this.val.Get("cmbPresupuesto").setValue("");
    this.val.Get("cmbFamilia").setValue("");

  }
  

  V_Limpiar_Item(id : string)
  {
    
    if(id == "cmbPresupuesto") 
      {
        this.cmbPresupuesto.deselectAllItems();
        this.servicio.Filtro.emit(["FILTRO_PRODUCTO", "", "", this.val.Get("cmbPresupuesto").value, this.val.Get("cmbFamilia").value]);
      }


    if(id == "cmbFamilia")
      {
        this.cmbFamilia.deselectAllItems();
        this.servicio.Filtro.emit(["FILTRO_PRODUCTO", this.val.Get("cmbPresupuesto").value, "", "", this.val.Get("cmbFamilia").value]);
      }

    
  }

  public V_Select_Presupuesto(event: any) {
    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      let cmb : any = this.cmbPresupuesto.dropdown;
      this.val.Get("cmbPresupuesto").setValue(event.newValue[0]);
      this.cmbPresupuesto.close();
    }

    this.servicio.Filtro.emit(["FILTRO_PRODUCTO", this.val.Get("cmbPresupuesto").value, "", this.val.Get("cmbFamilia").value, ""]);
  }

  public V_Enter_Presupuesto(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbPresupuesto.dropdown;
      let _Item: any = cmb._focusedItem.value;
      this.cmbPresupuesto.setSelectedItem(_Item.Codigo);
      this.val.Get("cmbPresupuesto").setValue([_Item.Codigo]);
    }
  }







  public V_Select_Familia(event: any) {


    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      let cmb : any = this.cmbFamilia.dropdown;
      this.val.Get("cmbFamilia").setValue(event.newValue[0]);
      this.cmbFamilia.close();
    }

    this.servicio.Filtro.emit(["FILTRO_PRODUCTO", this.val.Get("cmbPresupuesto").value, "", this.val.Get("cmbFamilia").value, ""]);
  }

  public V_Enter_Familia(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbFamilia.dropdown;
      let _Item: any = cmb._focusedItem.value;
      this.cmbFamilia.setSelectedItem(_Item.Codigo);
      this.val.Get("cmbFamilia").setValue([_Item.Codigo]);

    }
  }


    

  
  ngDoCheck() {

    if (this.cmbPresupuesto != undefined) this.cmbPresupuesto.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";
    if (this.cmbFamilia != undefined) this.cmbFamilia.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";



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
      this.val.addFocus("cmbFamilia", "btnImprimir-Reporte-Inv", "click");
    
  
  
  }


  ngOnInit() {

    this.servicio.Salida.subscribe((result: iReporteService[]) => {

       let d : iReporteService = result.find(f => f.Filtro == "Filtro5")!;

       if(d == undefined) return;
       
       this.DatosFiltro = d;
       this.lstGrupoPre = d.Datos[0];
       this.lstFamilia = d.Datos[1];


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

import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  IgxComboComponent, IgxComboModule, IgxIconModule } from 'igniteui-angular';
import { CommonModule } from '@angular/common';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { iReporteService } from 'src/app/INV/Interface/i-Reporte-Service';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { ReporteVentaService } from 'src/app/FAC/Servicio/reporte-venta.service';


@Component({
  selector: 'app-reporte-venta-filtro-1',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './reporte-venta-filtro-1.component.html',
  styleUrl: './reporte-venta-filtro-1.component.scss'
})
export class ReporteVentaFiltro1Component {
  public val = new Validacion();
  lstGrupoPre: any[] = [];
  lstFamilia: any[] = [];
  lstSubFamilia: any[] = [];

 
  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;


  @ViewChild("cmbPresupuesto", { static: false })
  public cmbPresupuesto: IgxComboComponent;

  @ViewChild("cmbFamilia", { static: false })
  public cmbFamilia: IgxComboComponent;


  @ViewChild("cmbSubFamilia", { static: false })
  public cmbSubFamilia: IgxComboComponent;

  private DatosFiltro : iReporteService;



  constructor(public cFunciones: Funciones, public servicio: ReporteVentaService) {

    this.val.add("cmbPresupuesto", "1", "LEN>=", "0", "", "");
    this.val.add("cmbFamilia", "1", "LEN>=", "0", "", "");
    this.val.add("cmbSubFamilia", "1", "LEN>=", "0", "", "");

    this.val.Get("cmbFamilia").setValue("");
    this.val.Get("cmbSubFamilia").setValue("");
    this.val.Get("cmbSubFamilia").setValue("");
    
  }
  

  

  V_Limpiar_Item(id : string)
  {
    
    if(id == "cmbPresupuesto") 
      {
        this.cmbPresupuesto.deselectAllItems();
      }



    if(id == "cmbFamilia")
      {
        this.cmbFamilia.deselectAllItems();
      }

    if(id == "cmbSubFamilia"){
      this.cmbSubFamilia.deselectAllItems();
    }

    
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




  
  public V_Select_Familia(event: any) {

    this.lstSubFamilia.splice(0, this.lstSubFamilia.length);

    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      let cmb : any = this.cmbFamilia.dropdown;
      this.val.Get("cmbFamilia").setValue(event.newValue[0]);
      this.cmbFamilia.close();


      let _Item: any = cmb._focusedItem?.value;
      this.lstSubFamilia = this.DatosFiltro.Datos[1].filter((f : any) => f.IdGrupo == _Item.IdGrupo);
      
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


  ngOnInit() {

    this.servicio.Salida.subscribe((result: iReporteService[]) => {

       let d : iReporteService = result.find(f => f.Filtro == "Filtro1")!;

       if(d == undefined) return;
       
       this.DatosFiltro = d;
       this.lstFamilia = d.Datos[0];
       this.lstSubFamilia = d.Datos[1];
       this.lstGrupoPre = d.Datos[2];
       
  
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

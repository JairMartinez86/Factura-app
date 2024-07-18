import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  IgxCardModule, IgxComboComponent, IgxComboModule, IgxIconModule } from 'igniteui-angular';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { CommonModule } from '@angular/common';
import { ReporteInventarioService } from 'src/app/INV/Servicio/reporte-inventario.service';
import { iReporteService } from 'src/app/INV/Interface/i-Reporte-Service';
import { iVendedor } from 'src/app/FAC/interface/i-venedor';

@Component({
  selector: 'app-reporte-inventario-filtro-9',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule, IgxCardModule,],
  templateUrl: './reporte-inventario-filtro-9.component.html',
  styleUrl: './reporte-inventario-filtro-9.component.scss'
})
export class ReporteInventarioFiltro9Component {
  public val = new Validacion();



  lstVendedor: iVendedor[] = [];



  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;


  @ViewChild("cmbVendedor", { static: false })
  public cmbVendedor: IgxComboComponent;


  

  private DatosFiltro : iReporteService;


  constructor(public cFunciones: Funciones, public servicio: ReporteInventarioService) {


    this.val.add("cmbVendedor", "1", "LEN>", "0", "Vendedor", "Seleccione un vendedor.");
    this.val.Get("cmbVendedor").setValue("");


  }

  


  public V_Select_Vendedor(event: any) {

    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      let cmb: any = this.cmbVendedor.dropdown;
      this.val.Get("cmbVendedor").setValue(event.newValue);
      this.cmbVendedor.close();
    }

  }



  public V_Enter_Vendedor(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbVendedor.dropdown;
      let _Item: iVendedor = cmb._focusedItem?.value;
      this.cmbVendedor.setSelectedItem(_Item?.Codigo);
      this.val.Get("cmbVendedor").setValue([_Item?.Codigo]);

    }
  }






  ngOnInit() {

    this.servicio.Salida.subscribe((result: iReporteService[]) => {

       let d : iReporteService = result.find(f => f.Filtro == "Filtro9")!;

       if(d == undefined) return;
       
       this.DatosFiltro = d;
       this.lstVendedor = d.Datos[0];
 
  
    },
      (error: any) => {
        // Errors
      },
      () => {

        // 'onCompleted' callback.
        // No errors, route to new page here
      });




  }


}

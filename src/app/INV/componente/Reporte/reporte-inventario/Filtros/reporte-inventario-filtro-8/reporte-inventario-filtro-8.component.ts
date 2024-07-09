import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  IgxCardModule, IgxComboComponent, IgxComboModule, IgxIconModule } from 'igniteui-angular';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { CommonModule } from '@angular/common';
import { ReporteInventarioService } from 'src/app/INV/Servicio/reporte-inventario.service';
import { iReporteService } from 'src/app/INV/Interface/i-Reporte-Service';
import { iCliente } from 'src/app/FAC/interface/i-Cliente';
import { ReporteInventarioFiltro2Component } from "../reporte-inventario-filtro-2/reporte-inventario-filtro-2.component";


@Component({
    selector: 'app-reporte-inventario-filtro-8',
    standalone: true,
    templateUrl: './reporte-inventario-filtro-8.component.html',
    styleUrl: './reporte-inventario-filtro-8.component.scss',
    imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule, IgxCardModule, ReporteInventarioFiltro2Component]
})
export class ReporteInventarioFiltro8Component {
  public val = new Validacion();



  lstCliente: iCliente[] = [];


  @ViewChild("Filtro", { static: false })
  public Filtro: ReporteInventarioFiltro2Component;





  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;


  @ViewChild("cmbCliente", { static: false })
  public cmbCliente: IgxComboComponent;


  

  private DatosFiltro : iReporteService;


  constructor(public cFunciones: Funciones, public servicio: ReporteInventarioService) {


    this.val.add("cmbCliente", "1", "LEN>", "0", "Cliente", "Seleccione un cliente.");
    this.val.Get("cmbCliente").setValue("");


  }

  


  public V_Select_Cliente(event: any) {

    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      let cmb: any = this.cmbCliente.dropdown;
      this.val.Get("cmbCliente").setValue(event.newValue);
      this.cmbCliente.close();
    }

  }



  public V_Enter_Cliente(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbCliente.dropdown;
      let _Item: iCliente = cmb._focusedItem?.value;
      this.cmbCliente.setSelectedItem(_Item?.Codigo);
      this.val.Get("cmbCliente").setValue([_Item?.Codigo]);

    }
  }






  ngOnInit() {

    this.servicio.Salida.subscribe((result: iReporteService[]) => {

       let d : iReporteService = result.find(f => f.Filtro == "Filtro8")!;

       if(d == undefined) return;
       
       this.DatosFiltro = d;
       this.lstCliente = d.Datos[0];
 
  
    },
      (error: any) => {
        // Errors
      },
      () => {

        // 'onCompleted' callback.
        // No errors, route to new page here
      });




  }

  private ngAfterViewInit() {
    this.val.ResetCssError();

  }

  private ngDoCheck() {
    this.val.ResetCssError();

  }
}

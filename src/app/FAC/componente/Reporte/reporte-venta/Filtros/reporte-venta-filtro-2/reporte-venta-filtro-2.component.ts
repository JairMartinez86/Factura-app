import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  IgxCardModule, IgxComboComponent, IgxComboModule, IgxIconModule } from 'igniteui-angular';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { CommonModule } from '@angular/common';
import { iBodega } from 'src/app/FAC/interface/i-Bodega';
import { iReporteService } from 'src/app/INV/Interface/i-Reporte-Service';
import { ReporteVentaService } from 'src/app/FAC/Servicio/reporte-venta.service';


@Component({
  selector: 'app-reporte-venta-filtro-2',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule, IgxCardModule],
  templateUrl: './reporte-venta-filtro-2.component.html',
  styleUrl: './reporte-venta-filtro-2.component.scss'
})
export class ReporteVentaFiltro2Component {
  public val = new Validacion();

  lstBodega: iBodega[] = [];
  public BodSeleccionadas : iBodega[];




  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;


  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;




  constructor(public cFunciones: Funciones, public servicio: ReporteVentaService) {

 
    this.val.add("cmbBodega", "1", "LEN>=", "0", "", "");
 

    this.val.Get("cmbBodega").setValue([]);


  }

  


  public V_Select_Bodega(event: any) {

    if (event.added.length) {
      let cmb: any = this.cmbBodega.dropdown;
      this.val.Get("cmbBodega").setValue(event.newValue);
      
     
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



  ngOnInit() {

    this.servicio.Salida.subscribe((result: iReporteService[]) => {

       let d : iReporteService = result.find(f => f.Filtro == "Filtro2")!;

       if(d == undefined) return;
       
       this.lstBodega = d.Datos[0];

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
}

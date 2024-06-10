import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalPositionStrategy, IgxComboComponent, IgxComboModule, IgxIconModule, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { CommonModule } from '@angular/common';
import { iBodega } from 'src/app/FAC/interface/i-Bodega';
import { iProducto } from 'src/app/FAC/interface/i-Producto';

@Component({
  selector: 'app-reporte-inventario-filtro-1',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './reporte-inventario-filtro-1.component.html',
  styleUrl: './reporte-inventario-filtro-1.component.scss'
})
export class ReporteInventarioFiltro1Component {
  public val = new Validacion();



  
  constructor(public cFunciones: Funciones,) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Ingrese una fecha valida.");
    this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Fdinal", "Ingrese una fecha valida.");


    this.val.Get("txtFecha1").setValue(this.cFunciones.ShortFechaServidor());
    this.val.Get("txtFecha2").setValue(this.cFunciones.ShortFechaServidor());


  }
  




  private ngAfterViewInit() {

      ///CAMBIO DE FOCO
      this.val.addFocus("txtFecha1", "txtFecha2", undefined);
      this.val.addFocus("txtFecha2", "btnImprimir-Reporte-Inv", "click");
  }


}

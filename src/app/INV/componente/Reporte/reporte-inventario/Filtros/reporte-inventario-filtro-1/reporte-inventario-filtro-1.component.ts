import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalPositionStrategy, IgxComboComponent, IgxComboModule, IgxDatePickerModule, IgxIconModule, IgxOverlayService, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { CommonModule } from '@angular/common';
import { iBodega } from 'src/app/FAC/interface/i-Bodega';
import { iProducto } from 'src/app/FAC/interface/i-Producto';

@Component({
  selector: 'app-reporte-inventario-filtro-1',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule, IgxDatePickerModule ],
  templateUrl: './reporte-inventario-filtro-1.component.html',
  styleUrl: './reporte-inventario-filtro-1.component.scss'
})
export class ReporteInventarioFiltro1Component {
  public val = new Validacion();

  @ViewChild("datepiker", { static: false })
  public datepiker: any;

  @ViewChild("datepiker2", { static: false })
  public datepiker2: any;



  
  constructor(public cFunciones: Funciones, public element: ElementRef) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Ingrese una fecha valida.");
    this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Fdinal", "Ingrese una fecha valida.");


    this.val.Get("txtFecha1").setValue(this.cFunciones.ShortFechaServidor());
    this.val.Get("txtFecha2").setValue(this.cFunciones.ShortFechaServidor());


  }
  





}

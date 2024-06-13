import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalPositionStrategy, IgxComboComponent, IgxComboModule, IgxDatePickerModule, IgxIconModule, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { CommonModule } from '@angular/common';
import { iReporteService } from 'src/app/INV/Interface/i-Reporte-Service';
import { ReporteInventarioService } from 'src/app/INV/Servicio/reporte-inventario.service';
import { iTipoMov } from 'src/app/INV/Interface/i-Tipo-Mov';

@Component({
  selector: 'app-reporte-inventario-filtro-6',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule, IgxDatePickerModule ],
  templateUrl: './reporte-inventario-filtro-6.component.html',
  styleUrl: './reporte-inventario-filtro-6.component.scss'
})
export class ReporteInventarioFiltro6Component {
  public val = new Validacion();
  lstTipoMov: iTipoMov[] = [];

  public overlaySettings: OverlaySettings = {};

  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;


  @ViewChild("cmbTipoMov", { static: false })
  public cmbTipoMov: IgxComboComponent;

  @ViewChild("datepiker", { static: false })
  public datepiker: any;

  @ViewChild("datepiker2", { static: false })
  public datepiker2: any;


  
  constructor(public cFunciones: Funciones, public servicio: ReporteInventarioService) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Ingrese una fecha valida.");
    this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Fdinal", "Ingrese una fecha valida.");
    this.val.add("cmbTipoMov", "1", "LEN>=", "0", "", "");


    this.val.Get("txtFecha1").setValue(this.cFunciones.ShortFechaServidor());
    this.val.Get("txtFecha2").setValue(this.cFunciones.ShortFechaServidor());


  }
  



/*
  private ngAfterViewInit() {


    this.val.Combo(this.lstCmb);

      ///CAMBIO DE FOCO
      this.val.addFocus("txtFecha1", "txtFecha2", undefined);
      this.val.addFocus("txtFecha2", "cmbTipoMov", undefined);
      this.val.addFocus("cmbTipoMov", "btnImprimir-Reporte-Inv", "click");


      
    if (this.cmbTipoMov != undefined) this.cmbTipoMov.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";


    this.overlaySettings = {};

    if (window.innerWidth <= 992) {
      this.overlaySettings = {
        positionStrategy: new GlobalPositionStrategy({ openAnimation: scaleInCenter, closeAnimation: scaleOutCenter }),
        modal: true,
        closeOnOutsideClick: true
      };
    }

    
  }

*/
  ngOnInit() {

    this.servicio.Salida.subscribe((result: iReporteService[]) => {

       let d : iReporteService = result.find(f => f.Filtro == "Filtro6")!;

       if(d == undefined) return;
       
       this.lstTipoMov = d.Datos[0];
   
  
    },
      (error: any) => {
        // Errors
      },
      () => {

        // 'onCompleted' callback.
        // No errors, route to new page here
      })
  }

  private ngAfterViewInit() {

    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";
    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker2 != undefined) this.datepiker2.mode="dialog";

  }

}

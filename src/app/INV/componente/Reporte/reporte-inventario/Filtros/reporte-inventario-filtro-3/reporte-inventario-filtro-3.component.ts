import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalPositionStrategy, IgxComboComponent, IgxComboModule, IgxDatePickerModule, IgxIconModule, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { CommonModule } from '@angular/common';
import { iSerie } from 'src/app/FAC/interface/i-Serie';
import { iReporteService } from 'src/app/INV/Interface/i-Reporte-Service';
import { ReporteInventarioService } from 'src/app/INV/Servicio/reporte-inventario.service';

@Component({
  selector: 'app-reporte-inventario-filtro-3',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule, IgxDatePickerModule],
  templateUrl: './reporte-inventario-filtro-3.component.html',
  styleUrl: './reporte-inventario-filtro-3.component.scss'
})
export class ReporteInventarioFiltro3Component {
  public val = new Validacion();
  lstSerie: iSerie[] = [];

  public overlaySettings: OverlaySettings = {};

  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;


  @ViewChild("datepiker", { static: false })
  public datepiker: any;

  @ViewChild("datepiker2", { static: false })
  public datepiker2: any;



  @ViewChild("cmbSerie", { static: false })
  public cmbSerie: IgxComboComponent;




  
  constructor(public cFunciones: Funciones, public servicio: ReporteInventarioService) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Ingrese una fecha valida.");
    this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Fdinal", "Ingrese una fecha valida.");
    this.val.add("cmbSerie", "1", "LEN>=", "0", "", "");


    this.val.Get("txtFecha1").setValue(this.cFunciones.ShortFechaServidor());
    this.val.Get("txtFecha2").setValue(this.cFunciones.ShortFechaServidor());
    this.val.Get("cmbSerie").setValue("");

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


  ngOnInit() {

    this.servicio.Salida.subscribe((result: iReporteService[]) => {

       let d : iReporteService = result.find(f => f.Filtro == "Filtro3")!;

       if(d == undefined) return;
       
       this.lstSerie = d.Datos[0];
  
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

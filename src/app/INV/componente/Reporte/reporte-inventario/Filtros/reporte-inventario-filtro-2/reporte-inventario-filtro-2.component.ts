import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalPositionStrategy, IgxCardModule, IgxComboComponent, IgxComboModule, IgxIconModule, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { CommonModule } from '@angular/common';
import { iProducto } from 'src/app/FAC/interface/i-Producto';
import { iBodega } from 'src/app/FAC/interface/i-Bodega';
import { ReporteInventarioService } from 'src/app/INV/Servicio/reporte-inventario.service';
import { iReporteService } from 'src/app/INV/Interface/i-Reporte-Service';
import { iTipoMov } from 'src/app/INV/Interface/i-Tipo-Mov';




@Component({
  selector: 'app-reporte-inventario-filtro-2',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule, IgxCardModule],
  templateUrl: './reporte-inventario-filtro-2.component.html',
  styleUrl: './reporte-inventario-filtro-2.component.scss'
})
export class ReporteInventarioFiltro2Component implements OnInit {
  public val = new Validacion();

  lstTipoMov: iTipoMov[] = [];
  lstBodega: iBodega[] = [];
  lstProductos1: iProducto[] = [];
  lstProductos2: iProducto[] = [];
  public BodSeleccionadas : iBodega[];

  public overlaySettings: OverlaySettings = {};

  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;


  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;


  @ViewChild("cmbProducto1", { static: false })
  public cmbProducto1: IgxComboComponent;

  @ViewChild("cmbProducto2", { static: false })
  public cmbProducto2: IgxComboComponent;

  
  @ViewChild("cmbTipoMov", { static: false })
  public cmbTipoMov: IgxComboComponent;

  

  private DatosFiltro : iReporteService;


  constructor(public cFunciones: Funciones, public servicio: ReporteInventarioService) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Ingrese una fecha valida.");
    this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Final", "Ingrese una fecha valida.");
    this.val.add("cmbBodega", "1", "LEN>=", "0", "", "");
    this.val.add("cmbTipoMov", "1", "LEN>=", "0", "", "");
    this.val.add("cmbProducto1", "1", "LEN>=", "0", "", "");
    this.val.add("cmbProducto2", "1", "LEN>=", "0", "", "");
    

    
    
    this.val.Get("txtFecha1").setValue(this.cFunciones.ShortFechaServidor());
    this.val.Get("txtFecha2").setValue(this.cFunciones.ShortFechaServidor());

    this.val.Get("cmbBodega").setValue("");
    this.val.Get("cmbTipoMov").setValue("");
    this.val.Get("cmbProducto1").setValue("");
    this.val.Get("cmbProducto2").setValue("");


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




  ngDoCheck() {

    if (this.cmbBodega != undefined) this.cmbBodega.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";
    if (this.cmbProducto1 != undefined) this.cmbProducto1.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";
    if (this.cmbProducto2 != undefined) this.cmbProducto2.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";



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
    this.val.addFocus("txtFecha2", "cmbBodega", undefined);
    this.val.addFocus("cmbBodega", "cmbTipoMov", undefined);
    this.val.addFocus("cmbTipoMov", "cmbProducto1", undefined);
    this.val.addFocus("cmbProducto1", "cmbProducto2", undefined);
    this.val.addFocus("cmbProducto2", "btnImprimir-Reporte-Inv", "click");
    
    if (this.cmbBodega != undefined) this.cmbBodega.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";
    if (this.cmbProducto1 != undefined) this.cmbProducto1.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";
    if (this.cmbTipoMov != undefined) this.cmbTipoMov.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";



  }


  ngOnInit() {

    this.servicio.Salida.subscribe((result: iReporteService[]) => {

       let d : iReporteService = result.find(f => f.Filtro == "Filtro2")!;

       if(d == undefined) return;
       
       this.DatosFiltro = d;
       this.lstBodega = d.Datos[0];
       this.lstProductos1 = d.Datos[1];
       this.lstProductos2 = d.Datos[1];
       this.lstTipoMov = d.Datos[2];

  
    },
      (error: any) => {
        // Errors
      },
      () => {

        // 'onCompleted' callback.
        // No errors, route to new page here
      });




      this.servicio.Filtro.subscribe(result => {
    
        if(result[0] == "FILTRO_PRODUCTO")
        {

           let p : iProducto[] = this.DatosFiltro.Datos[1].filter((f : any) => f.IdGrupoPresupuestario == (result[1] == "" ? f.IdGrupoPresupuestario : result[1]) && f.CodProveedorEscasan == (result[2] == "" ? f.CodProveedorEscasan : result[2]) && f.IdGrupo == (result[3] == "" ? f.IdGrupo : result[3])  && f.IdSubGrupo == (result[4] == "" ? f.IdSubGrupo : result[4]));
           this.lstProductos1 = p;
           this.lstProductos2 = p;

           this.cmbProducto1.deselectAllItems();
           this.cmbProducto2.deselectAllItems();
         

           this.val.Get("cmbProducto1").setValue([]);
           this.val.Get("cmbProducto2").setValue([]);


        }

   
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

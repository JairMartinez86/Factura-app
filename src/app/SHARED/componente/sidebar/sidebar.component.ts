import { Component, HostListener, Input, Inject, Renderer2, ViewChild, ComponentRef, COMPILER_OPTIONS } from '@angular/core';
import { DynamicFormDirective } from '../../directive/dynamic-form.directive';
import { FacturaComponent } from 'src/app/FAC/componente/factura/factura.component';
import * as $ from 'jquery';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { RegistroFacturaComponent } from 'src/app/FAC/componente/factura/registro-factura/registro-factura.component';
import { LoginService } from '../../service/login.service';
import { getServidor } from '../../GET/get-servidor';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';
import { iDatos } from '../../interface/i-Datos';
import { Funciones } from '../../class/cls_Funciones';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WaitComponent } from '../wait/wait.component';
import { Subscription, interval } from 'rxjs';
import { RequisaAutorizaComponent } from 'src/app/FAC/componente/requisa/requisa-autoriza/requisa-autoriza.component';
import { LiberacionPrecioComponent } from 'src/app/FAC/componente/liberacion-factura/liberacion-precio.component';
import { iPerfil } from '../../interface/i-Perfiles';
import { LiberacionBonificacionComponent } from 'src/app/FAC/componente/liberacion-bonificacion/liberacion-bonificacion.component';
import { AccesoWebComponent } from 'src/app/SIS/componente/acceso-web/acceso-web.component';
import { RequisaPermisoComponent } from 'src/app/FAC/componente/requisa/requisa-permiso/requisa-permiso.component';
import { ReporteInventarioTransaccDiariaComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-transacc-diaria/reporte-inventario-transacc-diaria.component';
import { ReporteInventarioTransaccEnprocesoComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-transacc-enproceso/reporte-inventario-transacc-enproceso.component';
import { ReporteInventarioRevConsecutivoComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-rev-consecutivo/reporte-inventario-rev-consecutivo.component';
import { ReporteInventarioTransaccionesComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-transacciones/reporte-inventario-transacciones.component';
import { ReporteInventarioTransaccionesResumenComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-transacciones-resumen/reporte-inventario-transacciones-resumen.component';
import { ReporteInventarioFacturaCostoComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-factura-costo/reporte-inventario-factura-costo.component';
import { EstadoCuentaComponent } from 'src/app/CXC/componente/estado-cuenta/estado-cuenta.component';
import { ReporteInventarioColumnarExistenciaComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-columnar-existencia/reporte-inventario-columnar-existencia.component';
import { ReporteInventarioVentaClienteComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-venta-cliente/reporte-inventario-venta-cliente.component';
import { ReporteInventarioVentaSucursalComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-venta-sucursal/reporte-inventario-venta-sucursal.component';
import { ReporteInventarioVentaMensualComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-venta-mensual/reporte-inventario-venta-mensual.component';
import { ReporteInventarioMargenProductoComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-margen-producto/reporte-inventario-margen-producto.component';
import { ReporteInventarioVentaProductoComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-venta-producto/reporte-inventario-venta-producto.component';
import { ReporteInventarioVentaProveedorComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-venta-proveedor/reporte-inventario-venta-proveedor.component';
import { ReporteInventarioVentaVendedorComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-venta-vendedor/reporte-inventario-venta-vendedor.component';
import { ReporteInventarioResumenComprasComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-resumen-compras/reporte-inventario-resumen-compras.component';
import { ReporteInventarioValidacionComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-validacion/reporte-inventario-validacion.component';
import { ReporteInventarioUltimasComprasComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-ultimas-compras/reporte-inventario-ultimas-compras.component';
import { ReporteInventarioUltimoFobComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-ultimo-fob/reporte-inventario-ultimo-fob.component';
import { ReporteInventarioFacturaProveedorComponent } from 'src/app/INV/componente/Reporte/reporte-inventario/reporte-inventario-factura-proveedor/reporte-inventario-factura-proveedor.component';
import { iLogin } from '../../interface/i-login';

const SCRIPT_PATH = 'ttps://cdn.jsdelivr.net/npm/bootstrap5-toggle@5.0.4/css/bootstrap5-toggle.min.css';
declare let gapi: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  @ViewChild(DynamicFormDirective, { static: true }) DynamicFrom!: DynamicFormDirective;
  public ErrorServidor: boolean = false;
  subscription: Subscription = {} as Subscription;
  private Perfil: iPerfil[] = [];


  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: HTMLDocument,
    private _SrvLogin: LoginService,
    private Conexion: getServidor,
    public cFunciones: Funciones,
  ) {
    this.ActualizarDatosServidor();
  }


  @Input() public href: string | undefined;
  @HostListener('click', ['$event']) public onClick(event: Event): void {

    var element = <HTMLElement>event.target;

    if (
      (!this.href ||
        this.href == '#' ||
        (this.href && this.href.length === 0))
    ) {

      if (element.tagName.toString().toLocaleLowerCase() == "a" && element.getAttribute("href") == "#" || element.tagName.toString().toLocaleLowerCase() == "i") {

        if (element.tagName.toString().toLocaleLowerCase() == "i") {

          element = <HTMLElement>event.target;
          element = <HTMLElement>element.parentElement;

        }

        if (element?.id == undefined) return
        this.v_Abrir_Form(element.id);
      }


      if (element.tagName.toString().toLocaleLowerCase() == "a") event.preventDefault();
      

    }
  }




  public v_Abrir_Form(id: string): void {

    if (id == "") return;
    if (id == "btnMenu") return;


   // document.getElementById("body")?.setAttribute("style", "overflow:auto");

   

    if (id == "aInicio"){
      $("#btnMenu").trigger("click");
      this.cFunciones.DIALOG.closeAll();
      this.DynamicFrom.viewContainerRef.clear();
    };

    

   
    if(this.ErrorServidor && id != "aSalir"){
      $("#btnMenu").trigger("click");
      this.cFunciones.DIALOG.closeAll();
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: "<b class='error'>" + "Obteniendo Información del servidor por favor espere." + "</b>",
      });
      return;
    }

    if (id == "aNewFactura" || id == "aNewDelivery") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      let Factura: ComponentRef<FacturaComponent> = this.DynamicFrom.viewContainerRef.createComponent(FacturaComponent);
      Factura.instance.TipoFactura = "Factura";
      Factura.instance.FactDelivery = false;
      if (id == "aNewDelivery") Factura.instance.FactDelivery = true;
    }

    if (id == "aNewProforma") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let Proforma: ComponentRef<FacturaComponent> = this.DynamicFrom.viewContainerRef.createComponent(FacturaComponent);
      Proforma.instance.TipoFactura = "Proforma";
    }

    if (id == "aRegistroFactura") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let RegFactura: ComponentRef<RegistroFacturaComponent> = this.DynamicFrom.viewContainerRef.createComponent(RegistroFacturaComponent);
      RegFactura.instance.TipoDocumento = "Factura";
    }

    if (id == "aRegistroProforma" || id == "aRegistroProformaVen") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let RegProforma: ComponentRef<RegistroFacturaComponent> = this.DynamicFrom.viewContainerRef.createComponent(RegistroFacturaComponent);
      RegProforma.instance.TipoDocumento = "Proforma";
      if (id == "aRegistroProformaVen") RegProforma.instance.ProformaVencida = true;
    }



    if (id == "idNavCola") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let RegProforma: ComponentRef<RegistroFacturaComponent> = this.DynamicFrom.viewContainerRef.createComponent(RegistroFacturaComponent);
      RegProforma.instance.TipoDocumento = "Factura";
      RegProforma.instance.EsCola = true;
    }



    if (id == "aAutorizaRequisa") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let AutorizaRequiza: ComponentRef<RequisaAutorizaComponent> = this.DynamicFrom.viewContainerRef.createComponent(RequisaAutorizaComponent);
    }

    if (id == "aLiberarPrecio") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let LiberarPrecio: ComponentRef<LiberacionPrecioComponent> = this.DynamicFrom.viewContainerRef.createComponent(LiberacionPrecioComponent);
    }

    if (id == "aLiberarBonificacion") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let LiberarBonif: ComponentRef<LiberacionBonificacionComponent> = this.DynamicFrom.viewContainerRef.createComponent(LiberacionBonificacionComponent);
    }






    if (id == "aRequisaPermiso") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let ReqPerm: ComponentRef<RequisaPermisoComponent> = this.DynamicFrom.viewContainerRef.createComponent(RequisaPermisoComponent);
    }






    //IVENTARIO

    if (id == "aReporte-TransInv") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aTransInv: ComponentRef<ReporteInventarioTransaccDiariaComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioTransaccDiariaComponent);
    }

    if (id == "aReporte-TransInvproc") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aTransInvProc: ComponentRef<ReporteInventarioTransaccEnprocesoComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioTransaccEnprocesoComponent);
    }

    if (id == "aReporte-rev-consecutivo") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aTransInvRecConecutivo: ComponentRef<ReporteInventarioRevConsecutivoComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioRevConsecutivoComponent);
    }


    if (id == "aReporte-TransaccInv") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aTransInv: ComponentRef<ReporteInventarioTransaccionesComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioTransaccionesComponent);
    }

    if (id == "aReporte-TransaccInvResumen") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aTranResumen: ComponentRef<ReporteInventarioTransaccionesResumenComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioTransaccionesResumenComponent);
    }


    if (id == "aReporte-FacturaCosto") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aFacturaCosto: ComponentRef<ReporteInventarioFacturaCostoComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioFacturaCostoComponent);
    }


    if (id == "aReporte-ColumnarExistencia") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aColumnarExistencia: ComponentRef<ReporteInventarioColumnarExistenciaComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioColumnarExistenciaComponent);
    }

    if (id == "aReporte-VentasPorCliente") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aVentasPorCliente: ComponentRef<ReporteInventarioVentaClienteComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioVentaClienteComponent);
    }


    if (id == "aReporte-VentasPorSucursal") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aVentasPorSucursal: ComponentRef<ReporteInventarioVentaSucursalComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioVentaSucursalComponent);
    }

    if (id == "aReporte-VentasMensuales") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aVentasMensuales: ComponentRef<ReporteInventarioVentaMensualComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioVentaMensualComponent);
    }
   
    if (id == "aReporte-MargenProducto") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aMargenProducto: ComponentRef<ReporteInventarioMargenProductoComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioMargenProductoComponent);
    }
   

    if (id == "aReporte-VentasPorProducto") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aVentaPorProducto: ComponentRef<ReporteInventarioVentaProductoComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioVentaProductoComponent);
    }
    
    if (id == "aReporte-VentasPorProveedor") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aVentasPorProveedor: ComponentRef<ReporteInventarioVentaProveedorComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioVentaProveedorComponent);
    }

    if (id == "aReporte-VentasPorVendedor") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aVentasPorVendedor: ComponentRef<ReporteInventarioVentaVendedorComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioVentaVendedorComponent);
    }

    if (id == "aReporte-ResumenCompras") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aResumenCompras: ComponentRef<ReporteInventarioResumenComprasComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioResumenComprasComponent);
    }
    
    if (id == "aReporte-ValidacionInventario") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aValidacionInventario: ComponentRef<ReporteInventarioValidacionComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioValidacionComponent);
    }

      
    if (id == "aReporte-UltimasCompras") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aUltimasCompras: ComponentRef<ReporteInventarioUltimasComprasComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioUltimasComprasComponent);
    }
    
    if (id == "aReporte-UltimoFob") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aUltimoFob: ComponentRef<ReporteInventarioUltimoFobComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioUltimoFobComponent);
    }
    
    if (id == "aReporte-FactProv") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aUltimoFob: ComponentRef<ReporteInventarioFacturaProveedorComponent> = this.DynamicFrom.viewContainerRef.createComponent(ReporteInventarioFacturaProveedorComponent);
    }
    
    

    //CARTERA

    if (id == "aCXC-Estado-Cuenta") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aEstadoCuenta: ComponentRef<EstadoCuentaComponent> = this.DynamicFrom.viewContainerRef.createComponent(EstadoCuentaComponent);
      aEstadoCuenta.instance.MostrarPermisos = false;
    }


    if (id == "aCXC-Permiso-Cartera") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let aPermisoCartera: ComponentRef<EstadoCuentaComponent> = this.DynamicFrom.viewContainerRef.createComponent(EstadoCuentaComponent);
      aPermisoCartera.instance.MostrarPermisos = true;
    }





    if (id == "idNavAccesoWeb") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let Acceso: ComponentRef<AccesoWebComponent> = this.DynamicFrom.viewContainerRef.createComponent(AccesoWebComponent);
    }




    if (id == "aSalir") {
      $("#btnMenu").trigger("click");
      this.ErrorServidor = true;
      this._SrvLogin.CerrarSession();

    }
  }



  private ActualizarDatosServidor(): void {
    this.ErrorServidor = false;


    this.Conexion.FechaServidor().subscribe(
      {
        next: (data) => {

          let _json: any = JSON.parse(data);
          this.cFunciones.ActualizarToken(_json["token"]);

          if (_json["esError"] == 1) {
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          } else {
            let Datos: iDatos[] = _json["d"];

            this.cFunciones.FechaServidor(Datos[0].d);
            this.cFunciones.SetTiempoDesconexion(Number(Datos[1].d));
            this._SrvLogin.UpdFecha(String(Datos[0].d));
            this.cFunciones.Lotificar = Datos[2].d;

            let Perfil: iPerfil[] = Datos[3].d;
            let index: number = -1;


            
            this.cFunciones.ActualizarToken(_json["token"]);



            this.Perfil.splice(0, this.Perfil.length);
            this.cFunciones.ACCESO.forEach(f => {

              index = Perfil.findIndex(w => w.Id == f.Id);

              if (index != -1) this.Perfil.push(f);


            });



          }

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") != undefined) {
            this.cFunciones.DIALOG.getDialogById("error-servidor")?.close();
          }


        },
        error: (err) => {


          
          this.ErrorServidor = true;


         /* if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
*/



        },
        complete: () => {

        }
      }
    );

  }


  public Menu(): any[] {
    return this.Perfil.filter(f => f.MenuPadre == "")
  }

  public SubMenu(Menu: string): any[] {
    return this.Perfil.filter(f => f.MenuPadre == Menu);
  }



  ngOnInit() {

    this.subscription = interval(60000).subscribe(val => this.ActualizarDatosServidor())

    //INSERTAR SCRIPT
    /*
    const script = this.renderer.createElement("script");
    this.renderer.setProperty(
      script,
      "text",
      "alert('asdsa')"
    );
    this.renderer.appendChild(this.document.body, script);
*/
    //FIN



  }

  ngAfterContentInit() {
    $("#btnMenu").trigger("click"); // MOSTRAR MENU DESDE EL INICIO
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();

  }


}




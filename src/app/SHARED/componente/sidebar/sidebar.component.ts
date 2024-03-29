import { Component, HostListener, Input, Inject, Renderer2, ViewChild, ComponentRef } from '@angular/core';
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
  private Perfil : iPerfil[] = [];


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
       
        if(element?.id == undefined) return
        this.v_Abrir_Form(element.id);
      }


      if (element.tagName.toString().toLocaleLowerCase() == "a") event.preventDefault();

    }
  }




  public v_Abrir_Form(id: string): void {

    if (id == "") return;
    if (id == "btnMenu") return;


    if (this.ErrorServidor && id != "aSalir") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: "<b class='error'>" + "Error al conectar con el servidor, por favor recargue la pagina o cierre sessión." + "</b>",
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
      this.DynamicFrom.viewContainerRef.clear();
      let RegFactura: ComponentRef<RegistroFacturaComponent> = this.DynamicFrom.viewContainerRef.createComponent(RegistroFacturaComponent);
      RegFactura.instance.TipoDocumento = "Factura";
    }

    if (id == "aRegistroProforma" || id == "aRegistroProformaVen") {
      this.DynamicFrom.viewContainerRef.clear();
      let RegProforma: ComponentRef<RegistroFacturaComponent> = this.DynamicFrom.viewContainerRef.createComponent(RegistroFacturaComponent);
      RegProforma.instance.TipoDocumento = "Proforma";
      if(id == "aRegistroProformaVen")RegProforma.instance.ProformaVencida = true;
    }
    


    if (id == "idNavCola") {
      this.DynamicFrom.viewContainerRef.clear();
      let RegProforma: ComponentRef<RegistroFacturaComponent> = this.DynamicFrom.viewContainerRef.createComponent(RegistroFacturaComponent);
      RegProforma.instance.TipoDocumento = "Factura";
      RegProforma.instance.EsCola = true;
    }


    
    if (id == "aAutorizaRequisa") {
      this.DynamicFrom.viewContainerRef.clear();
      let AutorizaRequiza: ComponentRef<RequisaAutorizaComponent> = this.DynamicFrom.viewContainerRef.createComponent(RequisaAutorizaComponent);
    }

    if (id == "aLiberarPrecio") {
      this.DynamicFrom.viewContainerRef.clear();
      let LiberarPrecio: ComponentRef<LiberacionPrecioComponent> = this.DynamicFrom.viewContainerRef.createComponent(LiberacionPrecioComponent);
    }

    if (id == "aLiberarBonificacion") {
      this.DynamicFrom.viewContainerRef.clear();
      let LiberarBonif: ComponentRef<LiberacionBonificacionComponent> = this.DynamicFrom.viewContainerRef.createComponent(LiberacionBonificacionComponent);
    }



    if (id == "aSalir") {
      this.ErrorServidor = true;
      this._SrvLogin.CerrarSession();

    }
  }

  
  
  private ActualizarDatosServidor() : void{
    this.ErrorServidor = false;


    this.Conexion.FechaServidor(this.cFunciones.User).subscribe(
      {
        next : (data) => {
          
          let _json : any = JSON.parse(data);

        if (_json["esError"] == 1) {
          if(this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined){
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

          let Perfil : iPerfil[] = Datos[3].d;
          let index : number = -1;

          this.Perfil.splice(0, this.Perfil.length);
          this.cFunciones.ACCESO.forEach(f =>{

            index = Perfil.findIndex( w => w.Id == f.Id);

            if(index != -1) this.Perfil.push(f);

            
          });



        }
		
		 if(this.cFunciones.DIALOG.getDialogById("error-servidor") != undefined) 
          {
            this.cFunciones.DIALOG.getDialogById("error-servidor")?.close();
          }


        },
        error: (err) => {

			  
		   this.ErrorServidor = true;
			
			  
			  if(this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) 
			  {
				this.cFunciones.DIALOG.open(DialogErrorComponent, {
				  id : "error-servidor",
				  data: "<b class='error'>" + err.message + "</b>",
				});
			  }
       
       
   

        },
        complete : ( ) => { 

        }
      }
    );
    
  }


  public Menu() : any[]{
    return this.Perfil.filter(f => f.MenuPadre == "")
  }

  public SubMenu(Menu : string) : any[]{
    return this.Perfil.filter(f => f.MenuPadre == Menu);
  }


  
  ngOnInit() {

    this.subscription = interval(10000).subscribe(val => this.ActualizarDatosServidor())
    
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




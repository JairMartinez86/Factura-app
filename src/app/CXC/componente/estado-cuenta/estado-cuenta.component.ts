import { Component, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  GlobalPositionStrategy, IgxCardModule, IgxComboComponent, IgxComboModule, IgxDatePickerModule, IgxIconModule, OverlaySettings } from 'igniteui-angular';
import { CommonModule } from '@angular/common';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { iCliente } from 'src/app/FAC/interface/i-Cliente';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { iEstadoCuenta } from '../../interface/i-estado-cuenta';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { MatDialogRef } from '@angular/material/dialog';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { getEstadoCuenta } from '../../GET/get-estado-cuenta';


@Component({
  selector: 'app-estado-cuenta',
  standalone: true,
  imports: [IgxComboModule, IgxIconModule, ReactiveFormsModule, CommonModule, FormsModule, IgxCardModule, IgxDatePickerModule, MatTableModule],
  templateUrl: './estado-cuenta.component.html',
  styleUrl: './estado-cuenta.component.scss'
})
export class EstadoCuentaComponent {

  public val = new Validacion();
  public overlaySettings: OverlaySettings = {};

  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;

  @ViewChild("cmbCliente", { static: false })
  public cmbCliente: IgxComboComponent;

  lstClientes: iCliente[] = [];

  public lstEstadoCuenta :  MatTableDataSource<iEstadoCuenta>;
  displayedColumns: string[] = ["col1"];

  SimboloMonedaLocal : string = "C$"
  SimboloMonedaSistema : string = "$"

  MonedaLocal : string = "CORDOBA"
  MonedaSistema : string = "DOLAR"

  MostrarSaldoCordoba : boolean = false;
  MostrarSaldoDolar : boolean = false;

  MostrarCorrienteCordoba : boolean = false;
  MostrarCorrienteDolar : boolean = false;

  public DatosCliente : any;


  public constructor(public cFunciones: Funciones, private GET : getEstadoCuenta){

    this.val.add("cmbCliente", "1", "LEN>", "0", "Cliente", "Seleccione un cliente.");
    this.V_CargarDatos("Clientes", "");

  }



  public V_Select_Cliente(event: any): void {

    this.lstEstadoCuenta?.data?.splice(0, this.lstEstadoCuenta.data.length);
    this.lstEstadoCuenta?._updateChangeSubscription();
    this.DatosCliente = undefined;
    
    this.MostrarCorrienteCordoba = false;
    this.MostrarSaldoCordoba = false;
    this.MostrarCorrienteDolar = false;
    this.MostrarSaldoDolar = false;

    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);

      this.V_CargarDatos("Estado Cuenta", event.newValue[0]);

      this.cmbCliente.close();

    }


  }

  public v_Enter_Cliente(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbCliente.dropdown;
      let _Item: iCliente = cmb._focusedItem.value;
      this.cmbCliente.setSelectedItem(_Item.Codigo);
      this.val.Get("cmbCliente").setValue([_Item.Codigo]);
    }
  }





  public V_CargarDatos(tipo : string, param : string): void {


    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {

        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );


    this.GET.GetDatos(tipo, param).subscribe(
      {
        next: (s) => {

          dialogRef.close();
          let _json = JSON.parse(s);

          if (_json["esError"] == 1) {
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          } else {
            let Datos: iDatos = _json["d"];
        
            
            if(Datos.Nombre == "Clientes"){
              this.lstClientes = Datos.d;
            }
            else{


              this.DatosCliente = Datos.d[0];
              this.lstEstadoCuenta = new MatTableDataSource(Datos.d[1]);
              this.lstEstadoCuenta._updateChangeSubscription();

              this.MostrarCorrienteCordoba = false;
              this.MostrarSaldoCordoba = false;
              this.MostrarCorrienteDolar = false;
              this.MostrarSaldoDolar = false;
              
              if(this.lstEstadoCuenta.data.filter(f => f.Corriente != 0 && f.IdMoneda == this.cFunciones.MonedaLocal).length > 0) this.MostrarCorrienteCordoba = true;
              if(this.lstEstadoCuenta.data.filter(f => f.Corriente !=0  && f.IdMoneda != this.cFunciones.MonedaLocal).length > 0) this.MostrarCorrienteDolar= true;

              
              if(this.lstEstadoCuenta.data.filter(f => (f.De1a30Dias + f.De31a60Dias + f.De61a90Dias + f.De91a120Dias + f.De121aMasDias) != 0 && f.IdMoneda == this.cFunciones.MonedaLocal).length > 0) this.MostrarSaldoCordoba = true;
              if(this.lstEstadoCuenta.data.filter(f => (f.De1a30Dias + f.De31a60Dias + f.De61a90Dias + f.De91a120Dias + f.De121aMasDias) != 0 && f.IdMoneda != this.cFunciones.MonedaLocal).length > 0) this.MostrarSaldoDolar = true;


            
            }

             
          }

        },
        error: (err) => {
          dialogRef.close();
        

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {

        }
      }
    );


  }




  public V_MostrarMaestro(Tipo: string, Moneda : string) : any {
    
    if(Tipo == "Corriente"){
      return this.lstEstadoCuenta?.data?.filter(f => f.Haber == 0 && f.Corriente != 0);
    }
    else
    {
      return this.lstEstadoCuenta?.data?.filter(f => f.Haber == 0 && f.Corriente == 0);
    }
   
  }


  public V_MostrarDetalle(NoDocOrigen : string)
  {
    this.lstEstadoCuenta?.data?.forEach(f =>{
     
      if(NoDocOrigen == f.NoDocOrigen || f.AplicadoA == NoDocOrigen){
        f.Expandir = !f.Expandir ;
      }
      else{
        f.Expandir = false;
      }
    });
  }

  public V_Expandir(NoDocOrigen : string) : iEstadoCuenta[] {
    return this.lstEstadoCuenta?.data.filter(f => (f.AplicadoA == NoDocOrigen || f.NoDocOrigen == NoDocOrigen) && f.Expandir);
  }

  public V_TotalSaldo(tipo : string, Moneda : string) : number
  {

    let Saldo : number = 0;

    if(tipo == "Corriente")
    {
      Saldo = this.lstEstadoCuenta?.data?.filter(f => f.IdMoneda == Moneda).reduce((acc, cur) => acc + cur.Corriente, 0);
    }
    else{
      Saldo = this.lstEstadoCuenta?.data?.filter(f => f.IdMoneda == Moneda).reduce((acc, cur) => (acc + cur.De1a30Dias + cur.De31a60Dias + cur.De61a90Dias + cur.De91a120Dias + cur.De121aMasDias), 0);
   
    }



      return Saldo;
  }

  private ngDoCheck() {


    this.val.Combo(this.lstCmb);



    if (this.cmbCliente != undefined) this.cmbCliente.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";


    this.overlaySettings = {};

    if (window.innerWidth <= 992) {
      this.overlaySettings = {
        positionStrategy: new GlobalPositionStrategy({ openAnimation: scaleInCenter, closeAnimation: scaleOutCenter }),
        modal: true,
        closeOnOutsideClick: true
      };
    }
 


  }


}

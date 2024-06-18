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
  SimboloMonedaSistema : string = "C$"

  MonedaLocal : string = "CORDOBA"
  MonedaSistema : string = "DOLAR"


  public constructor(public cFunciones: Funciones){

    this.val.add("cmbCliente", "1", "LEN>", "0", "Cliente", "Seleccione un cliente.");
    this.lstEstadoCuenta = new MatTableDataSource<iEstadoCuenta>();
    this.lstEstadoCuenta.data.push({NoDocOrigen : "T123456", FechaDocumento : "31-12-2024" , IdMoneda : "COR", NoDocEnlace : "", Total:  20000000,  Saldo :  500, Corriente : 0, Dias : 60, Expandir: false});
    this.lstEstadoCuenta.data.push({NoDocOrigen : "A999999", FechaDocumento : "01-06-2023" , IdMoneda : "COR", NoDocEnlace : "", Total: 1000,Saldo : 1000, Corriente : 0, Dias : 0, Expandir : false});
    this.lstEstadoCuenta.data.push({NoDocOrigen : "ROC-A000001", FechaDocumento : "08-08-2024" , IdMoneda : "COR", NoDocEnlace : "T123456", Total: -1000,Saldo : 0, Corriente : 0, Dias : 0, Expandir : false});
    this.lstEstadoCuenta.data.push({NoDocOrigen : "ROC-A000002", FechaDocumento : "08-08-2024" , IdMoneda : "COR", NoDocEnlace : "T123456", Total: -500,Saldo : 0, Corriente : 0, Dias : 0, Expandir : false});
    this.lstEstadoCuenta.data.push({NoDocOrigen : "ROC-A000009", FechaDocumento : "08-08-2024" , IdMoneda : "COR", NoDocEnlace : "A999999", Total: 0, Saldo: 0, Corriente : 0,  Dias : 0, Expandir : false});



  }


  public V_MostrarMaestro(Moneda : string) : any {
    return this.lstEstadoCuenta.data.filter(f => f.NoDocEnlace == "");
  }


  public V_MostrarDetalle(NoDocOrigen : string)
  {
    this.lstEstadoCuenta.data.forEach(f =>{
     
      if(NoDocOrigen == f.NoDocEnlace || f.NoDocOrigen == NoDocOrigen){
        f.Expandir = !f.Expandir ;
      }
      else{
        f.Expandir = false;
      }
    });
  }

  public V_Expandir(NoDocOrigen : string) : iEstadoCuenta[] {
    return this.lstEstadoCuenta.data.filter(f => (f.NoDocEnlace == NoDocOrigen || f.NoDocOrigen == NoDocOrigen) && f.Expandir);
  }

  public V_TotalSaldo(tipo : string, Moneda : string) : number
  {

    let Saldo : number = 0;

    if(tipo == "Corriente")
      {
        Saldo = this.lstEstadoCuenta.data.filter(f => f.IdMoneda == Moneda).reduce((acc, cur) => acc + cur.Saldo, 0);
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

import { Component, Inject, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { iFormaPago } from 'src/app/FAC/interface/i-forma-pago';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { GlobalPositionStrategy, IgxComboComponent, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getFactura } from 'src/app/FAC/GET/get-factura';
import { MatTableDataSource } from '@angular/material/table';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { postFactura } from 'src/app/FAC/POST/post-factura';
import { iFacturaPagoCancelacion } from 'src/app/FAC/interface/i-Factura-Pago-Cancelacion';

@Component({
  selector: 'app-fact-pago',
  templateUrl: './fact-pago.component.html',
  styleUrl: './fact-pago.component.scss'
})
export class FactPagoComponent {

  public valTabla = new Validacion();

  displayedColumns: string[] = ["col1"];
  public lstFormaPago : any[] = [];
  public lstDetalle = new MatTableDataSource<iFormaPago>;

  public Repuesta : number = 0;
  

  public overlaySettings: OverlaySettings = {};


  @ViewChildren(IgxComboComponent)
  public cmbPago: QueryList<IgxComboComponent>;


  public str_Total_Cor : string = "0.00";
  public str_Pago_Cod : string = "0.00";
  public str_Vuelto_Cod : string = "0.00";


  public str_Total_Dol : string = "0.00";
  public str_Pago_Dol: string = "0.00";
  public str_Vuelto_Dol : string = "0.00";
  public str_Etiqueta_Vuelto = "DEBE";
  private VueltoCordoba : number = 0;
  private VueltoDolar : number = 0;
  private Fecha: Date;
  private  IdFactura : number = 0;


  public TC : number;

  
  constructor(public cFunciones: Funciones,  private GET: getFactura, private POST: postFactura,
    public dialogRef: MatDialogRef<FactPagoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[],
  ) {


    this.str_Total_Cor = this.cFunciones.NumFormat(data[0], "2");
    this.str_Total_Dol = this.cFunciones.NumFormat(data[1], "2");
    this.TC = data[2];
    this.Fecha = data[3];
    this.IdFactura = data[4];
    this.V_Agrega();
    this.V_Refrescar();
  }



  public V_Select_Pago(event: any, det: iFormaPago): void {
    this.valTabla.Get("cmbPago" + det.Index).setValue("");
    
    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
   
   

      let cmb: IgxComboComponent = event.owner

      let item: any = this.lstFormaPago.find(f => f.Key == event.newValue[0])!;


      det.IdFormaPago = item?.IdFormaPago;
      det.NoDoc = "";
      det.Fecha = this.cFunciones.DateFormat(this.Fecha, "yyyy-MM-dd");
      if(det.Importe ==  undefined || item.EsTransaccion) det.Referencia = "";
      det.IdBanco = item?.IdBanco;
      if(det.Importe ==  undefined) det.Importe = "0.00";
      det.IdMoneda = item.IdMoneda;
      det.ImporteDolar = 0;
      det.ImporteCordoba = 0;
      det.EsTransaccion = item?.EsTransaccion;
      det.EsRetencion = item?.EsRetencion;
      

      this.valTabla.Get("cmbPago" + det.Index).setValue([item.IdPago]);

      document.getElementById("txtImporte" + det.Index)?.setAttribute("disabled", "disabled");
      document.getElementById("txtReferencua" + det.Index)?.setAttribute("disabled", "disabled");

      if(!item.EsRetencion)document.getElementById("txtImporte" + det.Index)?.removeAttribute("disabled");


      this.valTabla.del("txtReferencia" + det.Index)
      this.valTabla.add("txtReferencia" + det.Index, "1", "LEN>=", "0", "Banco", "Ingrese una Refrencia");
      if(item.EsTransaccion)
      {
        this.valTabla.del("txtReferencia" + det.Index)
        this.valTabla.add("txtReferencia" + det.Index, "1", "LEN>", "0", item.Descripcion2, "Ingrese una refrencia.");
        this.valTabla.add("txtReferencia" + det.Index, "2", "LEN<=", "12", item.Descripcion2, "La Referencia no debe de superarar los 12 caracteres.");
        document.getElementById("txtReferencia" + det.Index)?.removeAttribute("disabled");
      }

      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) cmb.close();
     this.V_Calcular();

    }



  }

  public V_Enter_Pago(event: any, det: iFormaPago) {

    if (event.key == "Enter") {

      let temp: any = this.cmbPago.find(f => f.id == "cmbPago" + det.Index);
      let cmb : any = temp.dropdown;


      let item: iFormaPago = cmb._focusedItem.value;
      if(!temp.selection.includes(det.IdPago[0])) temp.setSelectedItem(item.IdPago);

      this.valTabla.Get("cmbPago" + det.Index).setValue([item.IdPago]);


      temp.close();
  
    }

  }



  public V_Aceptar() : void{

    this.valTabla.EsValido();


    if(this.valTabla.Errores != "")
    {

      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data:
          "<ul>" + this.valTabla.Errores + "</ul>",
      });
      return;
   
    }


    let datos : iFormaPago[] = [];
    let strError : string = "";

    if(this.str_Etiqueta_Vuelto == "DEBE"){
      strError = "<li>No se ha pagado la totalidad de la factura.</li>";
    }



    if(strError != "")
    {

      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data:
          "<ul>" + strError + "</ul>",
      });
      return;
   
    }


    this.lstDetalle.data.filter(f => Number(String(f.Importe).replaceAll(",", "")) > 0 && !f.EsTransaccion && f.IdFormaPago == 1 ).forEach(x =>{
      datos.push(x);
    });


    this.lstDetalle.data.filter(f => Number(String(f.Importe).replaceAll(",", "")) > 0 && f.EsTransaccion && f.IdFormaPago == 4 ).forEach(x =>{
      datos.push(x);
    });



    if(this.lstDetalle.data.filter(f => f.IdFormaPago == 1 && f.IdMoneda == this.cFunciones.MonedaLocal).length > 1){
      strError = "<li>Solo se permiten 1 forma de pago en " + this.cFunciones.MonedaLocal + "</li>";
    }


    if(this.lstDetalle.data.filter(f => f.IdFormaPago == 1 && f.IdMoneda != this.cFunciones.MonedaLocal).length > 1){
      strError = "<li>Solo se permiten 1 forma de pago en US</li>";
    }


    if(this.lstDetalle.data.filter(f => f.IdFormaPago == 4).length > 1){
      strError = "<li>Solo se permiten 2 tarjetas como forma de pago.</li>";
    }

    
    if(this.lstDetalle.data.filter(f => f.IdFormaPago == 5).length > 1){
      strError = "<li>Retencion duplicada</li>";
    }


    if(this.lstDetalle.data.filter(f => f.IdFormaPago == 6).length > 2){
      strError = "<li>Retencion duplicada</li>";
    }


    if(this.lstDetalle.data.filter(f => f.IdFormaPago == 4).length > 0 && (this.VueltoDolar > 0 || this.VueltoCordoba > 0)){


      if(this.lstDetalle.data.filter(f => f.IdFormaPago == 1).length == 0){
        strError = "<li>Por favor revise la forma de pago.</li>";
      }
      else
      {
        let TCordoba : number = 0;
        this.lstDetalle.data.filter(f => f.IdFormaPago == 1).forEach(a => TCordoba += a.ImporteCordoba)

        if(TCordoba < this.VueltoCordoba ){
          strError = "<li>Por favor revise la forma de pago.<li>";
        }
       
      }

      
      
    }


    if(strError != "")
    {

      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data:
          "<ul>" + strError + "</ul>",
      });
      return;
   
    }

    



    if(this.str_Etiqueta_Vuelto = "VUELTO"){

      let _Fila_Vuelto : iFormaPago = this.lstDetalle.data.sort(o => o.IdFormaPago)[0];


      let p : iFormaPago = {} as iFormaPago;
      p.Index = (datos.length + 1) * -1;
      p.IdRecDetPago = -1;
      p.IdRecibo = -1;
      p.IdPago = [];
      p.IdFormaPago = _Fila_Vuelto.IdFormaPago;
      p.NoDoc = ""
      p.Fecha = this.cFunciones.DateFormat(this.Fecha, "yyyy-MM-dd");
      p.Referencia = _Fila_Vuelto.Referencia;
      p.IdBanco = _Fila_Vuelto.IdBanco;
      p.IdMoneda = _Fila_Vuelto.IdMoneda;
      p.Importe = this.cFunciones.Redondeo((_Fila_Vuelto.IdMoneda == this.cFunciones.MonedaLocal? this.VueltoCordoba : this.VueltoDolar )  * -1, "2");
      p.ImporteCordoba =  this.cFunciones.Redondeo(this.VueltoCordoba * -1, "2");
      p.ImporteDolar = this.cFunciones.Redondeo(this.VueltoDolar * -1, "2");
      p.EsTransaccion = _Fila_Vuelto.EsTransaccion;
      p.strEvento =  "AGREGAR";
      datos.push(p);

    }

    datos.forEach(f =>{ f.Importe = Number(String(f.Importe).replaceAll(",", "")) });


    let DatosPago = this.cFunciones.InterfaceColToString(datos , ["IdRecibo", "IdFormaPago", "NoDoc", "Fecha", "Referencia", "IdBanco", "IdMoneda", "Importe", "ImporteDolar", "ImporteCordoba", "strEvento"]);
   
   


    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    let Pago : iFacturaPagoCancelacion = {} as iFacturaPagoCancelacion;
    Pago.IdFactura = this.IdFactura;
    Pago.Pago = DatosPago;
    
    this.POST.PagarFactura(Pago).subscribe(
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

            this.Repuesta = 1;
            this.dialogRef.close();

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
          dialogRef.close();
        }
      }
    );
   
   
  

  }

  public V_Cancelar() : void{


    this.Repuesta = 0;
    this.dialogRef.close();

  }


  public V_Refrescar() : void{


    
    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );


    
   
  
      this.GET.GetFormaPago().subscribe(
        {
          next: (s) => {

            dialogRef.close();


            let _json: any =  JSON.parse(s);;

            if (_json.esError == 1) {

              if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
                this.cFunciones.DIALOG.open(DialogErrorComponent, {
                  id: "error-servidor-msj",
                  data: _json["msj"].Mensaje,
                });
              }
            } else {


              let Datos: iDatos = _json["d"];

        
              this.lstFormaPago = Datos.d
              
          
              

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
            return;
          },
          complete: () => {
            dialogRef.close();
          }
        }
      );

    



  }




  public V_Eliminar(Index : number){


    let i : number = this.lstDetalle.data.findIndex( f => f.Index == Index);
    if(i != undefined) this.lstDetalle.data.splice(i, 1);

    this.lstDetalle._updateChangeSubscription();
    this.V_Calcular();
  }


  public V_Agrega() : void
  {
    if(!this.valTabla.EsValido()) return ;

    let p : iFormaPago = {} as iFormaPago;
    let x : number = 0;

    if(this.lstDetalle.data.length > 0) x = Math.max(...this.lstDetalle.data.map(o => o.Index));

    x++;

    this.valTabla.add("cmbPago" + x, "1", "LEN>", "0", "Pago", "Seleccione una forma de pago.");
    this.valTabla.add("txtImporte" + x, "1", "NUM>", "0", "Pago", "Ingrese el importe a pagar");
    this.valTabla.add("txtReferencia" + x, "1", "LEN>=", "0", "Banco", "Ingrese una Refrencia");

    p.Index  = x;
    p.IdRecDetPago = -1;
    p.IdRecibo  = -1;
    p.IdPago = undefined;
    p.IdFormaPago = -1;
    p.NoDoc = "";
    p.Fecha = this.cFunciones.DateFormat(this.Fecha, "yyyy-MM-dd");
    p.Referencia = "";
    p.IdBanco = "NULL";
    p.IdMoneda =  this.cFunciones.MonedaLocal;;
    p.Importe = "0.00";
    p.ImporteDolar  = 0;
    p.ImporteCordoba = 0;
    p.EsTransaccion = false;
    p.EsRetencion = false;
    p.strEvento = "";
    
    this.lstDetalle.data.push(p);


    this.lstDetalle.data.sort(function (a, b) {
      return  Number(b.Index) - Number(a.Index)
    })

    this.lstDetalle._updateChangeSubscription();

    
    setTimeout(() => {

     

      document.getElementById("txtImporte" + x)?.setAttribute("disabled", "disabled");
      document.getElementById("txtReferencia" + x)?.setAttribute("disabled", "disabled");
   
    });



  }


  public V_UltimoIndex() : number{
    return  Math.max(...this.lstDetalle.data.map(o => o.Index));
  }



  
  public V_Calcular(){




    let PagoDolar : number = 0;
    let PagoCordoba : number = 0;
    let TotalCordoba : number = Number(this.str_Total_Cor.replaceAll(",", ""));
    let TotaDolar : number = Number(this.str_Total_Dol.replaceAll(",", ""));
    this.VueltoCordoba  = 0;
    this.VueltoDolar  = 0;


    this.lstDetalle.data.forEach(_Fila =>{
      let Importe : any = String(_Fila.Importe).replaceAll(",", "");

      if(isNaN(Importe)) Importe = 0;

      Importe = this.cFunciones.Redondeo(Number(_Fila.Importe), "2");



      if(_Fila.IdMoneda == this.cFunciones.MonedaLocal){
        _Fila.ImporteCordoba = Importe;
        _Fila.ImporteDolar = this.cFunciones.Redondeo(_Fila.ImporteCordoba / this.TC, "2");
      }
      else{
        _Fila.ImporteDolar = Importe;
        _Fila.ImporteCordoba = this.cFunciones.Redondeo(_Fila.ImporteDolar * this.TC, "2");
      }

      PagoDolar += _Fila.ImporteDolar;
      PagoCordoba += _Fila.ImporteCordoba;
      _Fila.Importe = this.cFunciones.NumFormat(Importe , "2");

   
    });


    this.VueltoDolar = this.cFunciones.Redondeo(PagoDolar -  TotaDolar, "2");
    this.VueltoCordoba =  this.cFunciones.Redondeo(PagoCordoba - TotalCordoba, "2")

    if(this.VueltoDolar >= 0 && this.VueltoCordoba >= 0) this.str_Etiqueta_Vuelto = "VUELTO";

    PagoDolar = this.cFunciones.Redondeo(PagoDolar, "2");
    PagoCordoba = this.cFunciones.Redondeo(PagoCordoba, "2");

    this.VueltoDolar = this.cFunciones.Redondeo(this.VueltoDolar, "2");
    this.VueltoCordoba = this.cFunciones.Redondeo(this.VueltoCordoba, "2");

    this.str_Pago_Cod = this.cFunciones.NumFormat(PagoCordoba, "2");
     this.str_Pago_Dol = this.cFunciones.NumFormat(PagoDolar, "2");

     this.str_Vuelto_Cod = this.cFunciones.NumFormat(this.VueltoCordoba, "2");
     this.str_Vuelto_Dol = this.cFunciones.NumFormat(this.VueltoDolar, "2");

    if(PagoDolar == 0) this.str_Pago_Dol = "-";
    if(PagoCordoba == 0) this.str_Pago_Dol = "-";

    if(this.VueltoDolar == 0) this.str_Vuelto_Cod = "-";
    if(this.VueltoCordoba == 0) this.str_Vuelto_Dol = "-";



  }


  
  ngOnInit(): void {

  

    this.overlaySettings = {};

    if (window.innerWidth <= 992) {
      this.overlaySettings = {
        positionStrategy: new GlobalPositionStrategy({ openAnimation: scaleInCenter, closeAnimation: scaleOutCenter }),
        modal: true,
        closeOnOutsideClick: true
      };
    }




    
  }
  
  
  ngDoCheck(){


    

    ///CAMBIO DE FOCO
    this.valTabla.Combo(this.cmbPago);

   

   this.lstDetalle.data.forEach(f => {
     this.valTabla.addFocus("cmbPago" + f.Index, "txtImporte" + f.Index, undefined);
     this.valTabla.addFocus("txtImporte" + f.Index, "txtReferencia" + f.Index, undefined);

     this.valTabla.addNumberFocus("txtImporte" + f.Index, 2);

    if(this.cmbPago != undefined)
     {
      let temp: any = this.cmbPago.find(w => w.id == "cmbPago" + f.Index);

      if (temp != undefined) temp.itemsWidth = (window.innerWidth <= 768 ? String(window.innerWidth) : "720") + "px";
 
     }



   });

  }

}

import { Component, Inject, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { MatTableDataSource } from '@angular/material/table';
import { iDetalleFactura } from 'src/app/FAC/interface/i-detalle-factura';
import { iExistenciaUbicacion } from 'src/app/FAC/interface/i-Existencia-Ubicacion';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { GlobalPositionStrategy, IgxComboComponent, OverlaySettings } from 'igniteui-angular';
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { from, groupBy } from 'rxjs';
import { getFactura } from 'src/app/FAC/GET/get-factura';
import { iVentaLote } from 'src/app/FAC/interface/i-Venta-Lote';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';

@Component({
  selector: 'app-fact-lotificar',
  templateUrl: './fact-lotificar.component.html',
  styleUrl: './fact-lotificar.component.scss'
})
export class FactLotificarComponent {

  public valTabla = new Validacion();
  public overlaySettings: OverlaySettings = {};

  displayedColumns: string[] = ["col1"];
  public lstDetalle = new MatTableDataSource<iDetalleFactura>;
  private lstExistencia : iExistenciaUbicacion[] = [];
  public lstLote: iVentaLote[] = [];
  private CodBodega: string = "";
  public DatosComboLote : iExistenciaUbicacion[] = [];
  public Repuesta : number = 0;
  


  @ViewChildren(IgxComboComponent)
  public cmbLote: QueryList<IgxComboComponent>;

  
  constructor(public cFunciones: Funciones,  private GET: getFactura,
    public dialogRef: MatDialogRef<FactLotificarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[],
  ) {


    this.CodBodega = data[0];
    this.lstDetalle.data = data[1];

    this.V_Refrescar();

    




  }

  private async Lotificar(IdVenta : any, Index : number, CodProducto : string,  Cantidad : number,  EsBonificado : boolean,  FactNegativo : boolean, Servicios : boolean, Exits : iExistenciaUbicacion[]) : Promise<number>{

    let Lotificado : number = 0;
    
    
    let AgregarFaltante : boolean = false;



    if( (Exits.filter( f=> f.CodProducto == CodProducto).reduce((acc, cur) => acc + Number(cur.Existencia), 0) - Cantidad) < 0 ) AgregarFaltante = true;

   for(let f of  (Exits.filter(o => o.CodProducto == CodProducto).sort((a,b) => (String(a.Vence) + String(a.Existencia)).localeCompare(String(b.Vence) + String(b.Existencia))))){



    let CantTotal : number = 0;

    if(this.lstLote.filter(w => w.Codigo == CodProducto  && w.Key[0] == f.Key).length > 0) CantTotal = this.lstLote.filter(w => w.Codigo == CodProducto && w.Key[0] == f.Key).reduce((acc, cur) => acc + Number(cur.Cantidad), 0);

    f.Existencia -= CantTotal;


      if(f.Existencia > 0)
      {
        if(Cantidad > f.Existencia)
        {


          if(f.Existencia < Cantidad )
          {
            Lotificado += this.V_AgregarLote( IdVenta ,f.Key, CodProducto, f.Existencia, f.Ubicacion, f.NoLote, f.Vence, f.Existencia, EsBonificado, false, false, Index, true)

          }
          else
          {
            Lotificado += this.V_AgregarLote(IdVenta, f.Key, CodProducto, Cantidad, f.Ubicacion, f.NoLote, f.Vence, f.Existencia, EsBonificado, false, false, Index, true)

          }

   
          Cantidad -= f.Existencia;
       

          if(Cantidad <= 0) break;
          if(f.Existencia <= 0) break;

        }
        else
        {
          Lotificado += this.V_AgregarLote(IdVenta, f.Key, CodProducto, Cantidad, f.Ubicacion, f.NoLote, f.Vence, f.Existencia, EsBonificado, false, false, Index, true);
          break;
        }

      }
      else
      {
        if(FactNegativo || Servicios)
        {

          AgregarFaltante = false

          let Key : string = CodProducto + this.CodBodega + "A00-00";

          Lotificado += this.V_AgregarLote(IdVenta, Key, CodProducto, Cantidad, "A00-00", "", undefined, 0, EsBonificado, FactNegativo, Servicios, Index, true);
          break;
        }
      }


    }



    if((FactNegativo || Servicios) && AgregarFaltante)
    {
      let Key : string = CodProducto + this.CodBodega + "A00-00";
      Lotificado += this.V_AgregarLote(IdVenta, Key, CodProducto, Cantidad, "A00-00", "", undefined, 0, EsBonificado, FactNegativo, Servicios, Index, true);
    }





    return Lotificado;

  }

  private V_CalcularExistencias(l : iExistenciaUbicacion, CodProducto : string) : number{


    let CantTotal : number = 0;

    if(this.lstLote.filter(w => w.Codigo == CodProducto  && w.Key == l.Key).length > 0) CantTotal = this.lstLote.filter(w => w.Codigo == CodProducto && w.Key == l.Key).reduce((acc, cur) => acc + Number(cur.Cantidad), 0);

    l.Existencia -= CantTotal;


    return l.Existencia;
  }


  private V_AgregarLote(IdVenta : any, Key : string, CodProducto : string,  Cantidad : number, Ubicacion : string, NoLote : string, Vence : any, Existencia : number, EsBonificado : boolean, FacturaNegativo : boolean, Servicios : boolean,  Index : number, Automatico : boolean) : number
  {
    let l : iVentaLote = {} as iVentaLote;
    let x : number = 0;

    if(this.lstLote.length > 0) x = Math.max(...this.lstLote.map(o => o.Index));

    x++;

    this.valTabla.add("cmbLote" + x, "1", "LEN>", "0", "Lote", "Seleccione un número de lote.");
    this.valTabla.add("txtCantidad" + x, "1", "LEN>", "0", "Lote", "Ingrese lacantidad a lotificar.");

    l.IdDetLote = "00000000-0000-0000-0000-000000000000";
    l.IdVenta = IdVenta
    l.IndexDet = Index;
    l.Codigo = CodProducto;
    l.EsBonificado = EsBonificado;
    l.FacturaNegativo = FacturaNegativo;
    l.Servicios = Servicios;
 

    l.Index = x;
    l.Key = [Key];
    l.Ubicacion = Ubicacion;
    if(Automatico)l.Cantidad = Cantidad;
    l.NoLote  = NoLote;
    l.Vence = Vence;
    l.Existencia  = Existencia;

    
    this.lstLote.push(l);

    
    setTimeout(() => {

     
      this.V_Filtrar_Lote(CodProducto, l);


      document.getElementById("txtCantidad" + x)?.setAttribute("disabled", "disabled");

      let cmb: any = this.cmbLote.find(y => y.id == "cmbLote" + l.Index);
      cmb.disabled = Automatico ? true : false;

   
    });



  
    return Cantidad;
  }


  public V_Filtrar_Existencia_Lote(Index : number) : iVentaLote[]{

    return this.lstLote.filter(f => f.IndexDet == Index);

  }

  public V_Filtrar_Existencia(CodProducto : string){

    
  
    let DatosCombo = JSON.parse(JSON.stringify(this.lstExistencia.filter(f => f.CodProducto == CodProducto && f.Existencia > 0)));

    DatosCombo.forEach((f:any) => {
      f.Existencia  = this.V_CalcularExistencias(f, CodProducto);
    });



    
    return DatosCombo.reduce((acc : any, cur : any) => acc + Number(cur.Existencia), 0);

  }

  
  public V_Filtrar_Lote(CodProducto : string, l : iVentaLote){


    let cmb: IgxComboComponent = this.cmbLote.find(f => f.id == "cmbLote" + l.Index)!;


    let DatosCombo = JSON.parse(JSON.stringify(this.lstExistencia.filter(f => f.CodProducto == CodProducto && f.Existencia > 0)));

    DatosCombo.forEach((f:any) => {
      f.Existencia  = this.V_CalcularExistencias(f, CodProducto);
    });



    
    cmb.data = DatosCombo.filter((f : any) =>   (f.Key == l.Key[0] ? 1 : f.Existencia ) > 0);




  }




  public v_Select_Lote(event: any, det: iDetalleFactura, l: iVentaLote): void {
    this.valTabla.Get("cmbLote" + l.Index).setValue("");
    
    if (event.added.length == 1) {
      if(event.newValue.length > 1) event.newValue.splice(0, 1);
   
   

      let cmb: IgxComboComponent = event.owner


      let i_Existencia: iExistenciaUbicacion = this.lstExistencia.find(f => f.Key == event.newValue[0])!;


      l.NoLote = i_Existencia?.NoLote;
      l.Vence = i_Existencia?.Vence;
      l.Ubicacion = i_Existencia?.Ubicacion;
      l.Cantidad = 0;

      this.valTabla.Get("cmbLote" + l.Index).setValue([l.Key]);

      this.V_Total_Lotificado(det, l);
   
      document.getElementById("txtCantidad" + l.Index)?.removeAttribute("disabled");

      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) cmb.close();

   
    }



  }

  public v_Enter_Lote(event: any, l: iVentaLote) {

    if (event.key == "Enter") {

      let temp: any = this.cmbLote.find(f => f.id == "cmbLote" + l.Index);
      let cmb : any = temp.dropdown;


      let i_Existencia: iExistenciaUbicacion = cmb._focusedItem.value;
      if(!temp.selection.includes(l.Key[0])) temp.setSelectedItem(i_Existencia.Key);

      this.valTabla.Get("cmbLote" + l.Index).setValue([i_Existencia.Key]);
      l.NoLote = i_Existencia.NoLote;
      l.Vence = i_Existencia.Vence;
      l.Ubicacion = i_Existencia.Ubicacion;

      temp.close();
  
    }

  }

public V_Total_Lotificado(det: iDetalleFactura, l: iVentaLote)
{
  
  let DatosCombo = JSON.parse(JSON.stringify(this.lstExistencia.filter(f =>  f.Key == l.Key)));
  let Cantidad : number = Number(String(l.Cantidad).replaceAll(",", ""));
  

  let i_Existencia: iExistenciaUbicacion = DatosCombo.find((f : any) => f.Key == l.Key);

  if(i_Existencia == undefined) return;

  if(Cantidad > i_Existencia.Existencia) Cantidad = i_Existencia.Existencia;

  i_Existencia.Existencia -= Cantidad;

  l.Cantidad = Cantidad;
  det.Lotificado = this.lstLote.filter(f => f.Codigo == det.Codigo && f.IndexDet == det.Index).reduce((acc, cur) => acc + Number(cur.Cantidad), 0);
}


  
  public V_Agregar(det: iDetalleFactura){

    this.V_AgregarLote(det.IdVenta, "", det.Codigo, 0, "", "", undefined, 0, det.EsBonif, det.FacturaNegativo, det.Servicios, det.Index, false);
  }


  public V_Eliminar(det: iDetalleFactura, l : iVentaLote){


    let index : number = this.lstLote.findIndex(f=> f.Index == l.Index);
    this.lstLote.splice(index, 1);

    det.Lotificado = this.lstLote.filter(f => f.Codigo == det.Codigo && f.IndexDet == det.Index).reduce((acc, cur) => acc + Number(cur.Cantidad), 0);

    this.valTabla.del("cmbLote" + l.Index);
    this.valTabla.del("txtCantiadd" + l.Index);

  }


  private EsValido() : string{

    let msj : string = "";


    this.lstDetalle.data.filter(f => f.Cantidad != f.Lotificado).forEach(f =>{

      if(!msj.includes(f.Codigo)) msj = "<li class='error-mensaje'>" + f.Codigo  + "</li>";

    });
    
    if(msj!= "")
    {
      msj = "<li class='error-etiqueta'>Error en lotificacion:<ul>" + msj + "</ul></li>"
    }

    return msj;
  }

  public V_Aceptar() : void{

    let msj = this.EsValido();

    if(msj != "")
    {

      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data:
          "<ul>" + msj + "</ul>",
      });
      return;
   
    }



    this.Repuesta = 1;
    this.dialogRef.close();

  }

  public V_Cancelar() : void{


    this.Repuesta = 0;
    this.dialogRef.close();

  }


  public V_Refrescar() : void{


    this.lstLote.splice(0, this.lstLote.length);


    
    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );


    let lstUb: iExistenciaUbicacion[] = [];
    let Reg: number = 0;
    let TotalReg: number = 0;
    let Prod : string[] = [];


    from(this.lstDetalle.data).pipe(
      groupBy(item => item.Codigo)
    ).subscribe( f => { Prod.push(f.key)});
      
  
    
   
    
      TotalReg = Prod.length - 1;

      Prod.forEach(async (w : any) => {

      await this.GET.GetExistenciaUbicacion(w, this.CodBodega).subscribe(
        {
          next: (s) => {


            let _json = JSON.parse(s);
            this.cFunciones.ActualizarToken(_json["token"]);
  
           
            if (_json["esError"] == 1) {
              if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
                this.cFunciones.DIALOG.open(DialogErrorComponent, {
                  id: "error-servidor-msj",
                  data: _json["msj"].Mensaje,
                });
  
  
              }
  
            } else {
              let DAT: iDatos = _json["d"];

              let datos : any =  JSON.parse(DAT.d);

     
              datos.forEach((fila : any) =>{
                lstUb.push(fila);
              });
              
              
  
  
              if (Reg >= TotalReg) {
  
             
                this.lstExistencia = lstUb;
         
  
                let Exits =  JSON.parse(JSON.stringify(this.lstExistencia ));
            
            
                this.lstDetalle.data.forEach(async (f : iDetalleFactura) =>{
            
                  f.Lotificado =  await this.Lotificar( f.IdVenta, f.Index, f.Codigo, f.Cantidad, f.EsBonif,   f.FacturaNegativo, f.Servicios, Exits);
            
                });
            
            
                
                this.lstDetalle._updateChangeSubscription();
  
  
              }
  
  
              Reg += 1;

        
  
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
            if (Reg >= TotalReg) dialogRef.close();
          }
        }
      );

     
    

    });








    




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
    this.valTabla.Combo(this.cmbLote);

   

   this.lstLote.forEach(f => {
     this.valTabla.addFocus("cmbLote" + f.Index, "txtCantidad" + f.Index, undefined);
     this.valTabla.addNumberFocus("txtCantidad" + f.Index, 2);

   });

     
 }



}

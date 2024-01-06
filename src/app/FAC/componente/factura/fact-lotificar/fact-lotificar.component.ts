import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { MatTableDataSource } from '@angular/material/table';
import { iDetalleFactura } from 'src/app/FAC/interface/i-detalle-factura';
import { iExitenciaLote } from 'src/app/FAC/interface/i-Exitencia-Lote';
import { iExistenciaUbicacion } from 'src/app/FAC/interface/i-Existencia-Ubicacion';

@Component({
  selector: 'app-fact-lotificar',
  templateUrl: './fact-lotificar.component.html',
  styleUrl: './fact-lotificar.component.scss'
})
export class FactLotificarComponent {


  displayedColumns: string[] = ["col1"];
  public lstDetalle = new MatTableDataSource<iDetalleFactura>;
  private lstExistencia : iExistenciaUbicacion[] = [];
  private lstLote: iExitenciaLote[] = [];
  private CodBodega: string = "";

  constructor(public cFunciones: Funciones,
    public dialogRef: MatDialogRef<FactLotificarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[],
  ) {


    this.CodBodega = data[0];
    this.lstExistencia = data[1];
    this.lstDetalle.data = data[2];

    this.lstDetalle.data.forEach(async (f : iDetalleFactura) =>{

      f.Lotificado =  await this.Lotificar(f.Index, f.Codigo, f.Cantidad, f.EsBonif, f.FacturaNegativo);

    });

    
    this.lstDetalle._updateChangeSubscription();




  }

  private async Lotificar(Index : number, CodProducto : string,  Cantidad : number,  EsBonificado : boolean,  FactNegativo : boolean) : Promise<number>{

    let Lotificado : number = 0;
    
    
    let AgregarFaltante : boolean = false;



    if( (this.lstExistencia.filter( f=> f.CodProducto == CodProducto).reduce((acc, cur) => acc + Number(cur.Existencia), 0) - Cantidad) < 0 ) AgregarFaltante = true;

    this.lstExistencia.filter(o => o.CodProducto == CodProducto).sort((a,b) => (String(a.Vence) + String(a.Existencia)).localeCompare(String(b.Vence) + String(b.Existencia))).forEach(f=>{

      f.Existencia = this.V_CalcularExistencias(f, CodProducto);


      if(f.Existencia > 0)
      {
        if(Cantidad > f.Existencia)
        {


          if(f.Existencia < Cantidad )
          {
            Lotificado += this.V_AgregarLote(f.Key, CodProducto, f.Existencia, f.Ubicacion, f.NoLote, f.Vence, f.Existencia, EsBonificado, false, Index)

          }
          else
          {
            Lotificado += this.V_AgregarLote(f.Key, CodProducto, Cantidad, f.Ubicacion, f.NoLote, f.Vence, f.Existencia, EsBonificado, false, Index)

          }

   
          Cantidad -= f.Existencia;
       

          if(Cantidad <= 0) return;
          if(f.Existencia <= 0) return;

        }
        else
        {
          Lotificado += this.V_AgregarLote(f.Key, CodProducto, Cantidad, f.Ubicacion, f.NoLote, f.Vence, f.Existencia, EsBonificado, false, Index);
          return;
        }

      }
      else
      {
        if(FactNegativo)
        {

          AgregarFaltante = false

          let Key : string = CodProducto + this.CodBodega + "A00-00S/L";

          Lotificado += this.V_AgregarLote(Key, CodProducto, Cantidad, "A00-00", "S/L", undefined, 0, EsBonificado, true, Index);
          return;
        }
      }


    });



    if(FactNegativo && AgregarFaltante)
    {
      let Key : string = CodProducto + this.CodBodega + "A00-00S/L";
      Lotificado += this.V_AgregarLote(Key, CodProducto, Cantidad, "A00-00", "S/L", undefined, 0, EsBonificado, true, Index);
    }





    return Lotificado;

  }

  private V_CalcularExistencias(l : iExistenciaUbicacion, CodProducto : string) : number{


    let CantTotal : number = 0;

    if(this.lstLote.filter(f => f.Codigo == CodProducto  && f.Key == l.Key).length > 0) CantTotal = this.lstLote.filter(f => f.Codigo == CodProducto && f.Key == l.Key).reduce((acc, cur) => acc + Number(cur.Cantidad), 0);

    l.Existencia -= CantTotal;


    return l.Existencia;
  }


  private V_AgregarLote(Key : string, CodProducto : string,  Cantidad : number, Ubicacion : string, NoLote : string, Vence : any, Existencia : number, EsBonificado : boolean, FacturaNegativo : boolean,  Index : number) : number
  {
    let l : iExitenciaLote = {} as iExitenciaLote;
    let x : number = 0;

    if(this.lstLote.length > 0) x = Math.max(...this.lstLote.map(o => o.Index));

    x++;


    l.IndexDet = Index;
    l.Codigo = CodProducto;
    l.EsBonificado = EsBonificado;
    l.FacturaNegativo = FacturaNegativo;
    l.strEvento  = "";

    l.Index = x;
    l.Key = Key;
    l.Ubicacion = Ubicacion;
    l.Cantidad = Cantidad;
    l.NoLote  = NoLote;
    l.Vence = Vence;
    l.Existencia  = Existencia;

    
    this.lstLote.push(l);


    return Cantidad;
  }


  public FiltrarLote(Index : number) : iExitenciaLote[]{

    return this.lstLote.filter(f => f.IndexDet == Index);

  }

  public EsValido() : string{


    return "true";

  }



}

import { Component, ElementRef, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import Chart from 'chart.js/auto'
import { getServidor } from 'src/app/SHARED/GET/get-servidor';
import { WaitComponent } from '../../wait/wait.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { DialogErrorComponent } from '../../dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { CommonModule } from '@angular/common';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { IgxComboComponent, IgxComboModule, IgxIconModule } from 'igniteui-angular';
import { iBodega } from 'src/app/FAC/interface/i-Bodega';
import { ReactiveFormsModule } from '@angular/forms';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-sidebar-charts',
  standalone: true,
  imports: [ CommonModule, IgxComboModule, ReactiveFormsModule, IgxIconModule],
  templateUrl: './sidebar-charts.component.html',
  styleUrl: './sidebar-charts.component.scss'
})
export class SidebarChatsComponent {

  private datos_1 : number[] = [];
  private datos_2 : number[] = [];
  public Titulo : string [] = ["", ""];
  private Meses : string[] = [];
  private lstDatos : any[] = [];
  public Total : number;
  public Sucursal : string = "";

  private myChart : Chart;
  


  public val = new Validacion();

  lstBodega: iBodega[] = [];



  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;


  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;

  @ViewChild('Charts_Venta_Neta', { static: false })
  private ctx: Chart;


landscape = window.matchMedia("(orientation: landscape)");
  constructor(private GET : getServidor, private cFunciones: Funciones){


    this.val.add("cmbBodega", "1", "LEN>=", "0", "", "");
 

    this.val.Get("cmbBodega").setValue([]);

    
   

  }





  public V_CargarCharts(): void {


    this.lstDatos.splice(0, this.lstDatos.length);

    document.getElementById("btn-Charts-Refrescar")?.setAttribute("disabled", "disabled");


    let dialogRef: MatDialogRef<WaitComponent>;


    if (this.cFunciones.DIALOG.getDialogById("dialog-wait") == undefined) {
      let dialogRef = this.cFunciones.DIALOG.open(
        WaitComponent,
        {
          panelClass: "escasan-dialog-full-blur",
          data: "",
          id: "dialog-wait-charts"
        }
      );
    }




  


    this.GET.GetCharts().subscribe(
      {
        next: (s) => {

          document.getElementById("btn-Charts-Refrescar")?.removeAttribute("disabled");
          this.cFunciones.DIALOG.getDialogById("dialog-wait-charts")?.close();

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
            let Datos: iDatos[] = _json["d"];

            this.lstBodega = Datos[0].d;
            this.lstDatos = Datos[1].d;
            this.Titulo = Datos[2].d;
            this.Meses = Datos[3].d;

            this.datos_1.splice(0, this.datos_1.length);
            this.datos_2.splice(0, this.datos_2.length);

            
            this.cmbBodega.setSelectedItem(this.cFunciones.Bodega);

            

            
          }

        },
        error: (err) => {
          document.getElementById("btn-Charts-Refrescar")?.removeAttribute("disabled");
          this.cFunciones.DIALOG.getDialogById("dialog-wait-charts")?.close();

   

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

  

  private Refrescar_Chart() : void{

  
    let myClonedObject : any[];

    let Bodegas : string[] = this.val.Get("cmbBodega").value;

    var Datos = JSON.parse(JSON.stringify(this.lstDatos));

    if(this.val.Get("cmbBodega").value.length == 0)
    {
      myClonedObject  = Object.assign([], Datos); 
    }
    else
    {
      myClonedObject  = Object.assign([], Datos.filter((f : any) =>  Bodegas.includes(f.Codigo))); 
    }

    this.Total = 0;

    myClonedObject.forEach((f : any) => {
      f.Codigo = "";
      f.Bodega = "";
      f.Contado = 0;
      f.Credito = 0;
      f.VentaBruta = 0;
      f.Devolucion = 0;
      f.Descuento = 0;
      f.Bodificado = 0;
    });



    var d1 : any[] = myClonedObject.filter(w => w.Anio == Number(this.Titulo[0])).reduce((acc, item) => {
  
      let accItem : any = acc.find( (ai : any) => ai.Anio == item.Anio && ai.Mes == item.Mes)

      
      
      if(accItem){
          accItem.VentaNeta += item.VentaNeta 
      }else{
         acc.push(item)
      }
      this.Sucursal = item.Codigo + " " + item.Bodega;
      return acc;
    },[]);


   
    var d2 : any[] = myClonedObject.filter(w => w.Anio == Number(this.Titulo[1])).reduce((acc, item) => {
  
      let accItem : any = acc.find( (ai : any) => ai.Anio == item.Anio && ai.Mes == item.Mes)

      
      
      if(accItem){
          accItem.VentaNeta += item.VentaNeta 
          
      }else{
         acc.push(item)
      }
      this.Sucursal = item.Codigo + " " + item.Bodega;
      this.Total += item.VentaNeta;
      return acc;
    },[]);



    d1 = d1.sort((a, b) => {return a.Mes - b.Mes;});
    d2 = d2.sort((a, b) => {return a.Mes - b.Mes;});

 

    this.datos_1.splice(0, this.datos_1.length);
    d1.forEach( f => {
      this.datos_1.push(f.VentaNeta);
    });

    this.datos_2.splice(0, this.datos_2.length);
    d2.forEach( f => {
      this.datos_2.push(f.VentaNeta);
    });



    this.Crear_Chart();
    

    
 



  }
 

  

  
  public V_Select_Bodega(event: any) {

    this.val.Get("cmbBodega").setValue(event.newValue);

    this.Refrescar_Chart();
  }



  public V_Enter_Bodega(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbBodega.dropdown;
      let _Item: iBodega = cmb._focusedItem?.value;
      this.cmbBodega.setSelectedItem(_Item?.Codigo);
      this.val.Get("cmbBodega").setValue([_Item?.Codigo]);

    }
  }


  ngOnInit() {



    this.landscape.addEventListener("change", (ev : any) => {
     

      this.Crear_Chart();

    });


    this.V_CargarCharts();
   

  }


  private Crear_Chart()
  {

    this.myChart?.destroy();

    this.myChart = new Chart("Charts_Venta_Neta", {
      data: {
          datasets: [{
              type: 'bar',
              label: this.Titulo[0],
              data: this.datos_1,
              backgroundColor: [
                'rgba(255, 69, 0, 0.4)',
              

            ],borderColor: [
              'rgba(255, 69, 0, 1)',


            ],
            borderWidth: 1,
              
          }, {
              type: 'bar',
              label: this.Titulo[1],
              data: this.datos_2,
              backgroundColor: [
                'rgba(0, 157, 67, 0.4)',


            ],
            borderColor: [
              'rgba(0, 157, 67, 1)',


            ],
            borderWidth: 1
          }],
          labels: this.Meses
      },
      options: {
        responsive: true,
        indexAxis: window.screen.orientation.angle == 90 ? "y" : "x",
        animation: {
          duration: 1000,
          onComplete: function() {
  
            
          }
        },
  
        scales: {
          x: {
            display: true,
          },
          y: {
            beginAtZero: true,
            display: true,
  
            
          }
        },
        plugins: {
          datalabels: {
            color: 'black',
            anchor: 'end',
            align: 'end',
            rotation: window.screen.orientation.angle == 0 ? -45 : 0, 
          font: {
            weight: 'bold',
            size:  window.innerWidth > this.cFunciones.TamanoPantalla("md")  ? 10: 6, 
          },
          
            formatter: function(value : any, context : any) {
  
              var v : any = (Math.abs(value)/1000).toFixed(1);
  
            //  return Math.abs(value) > 999 ? Math.sign(value)* v + 'k' : Math.sign(value)*Math.abs(value)
  
  
            return  value.toLocaleString('en-US', {
                // add suffixes for thousands, millions, and billions
                // the maximum number of decimal places to use
                maximumFractionDigits: 2,
                // specify the abbreviations to use for the suffixes
                notation: 'compact',
                compactDisplay: 'short'
              });
  
  
  
            }
          }
    
        }
      }
  ,
      plugins: [ChartDataLabels],

  });


  }


}

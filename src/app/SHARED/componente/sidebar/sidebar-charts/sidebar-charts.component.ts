import { ChangeDetectionStrategy, Component, ElementRef, QueryList, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
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
import { IgxDataChartCoreModule, IgxDataChartCategoryModule, IgxLegendModule, IgxCalloutLayerModule, IgxDataChartInteractivityModule, IgxDataChartAnnotationModule, IgxNumberAbbreviatorModule, IgxDataChartCategoryCoreModule, IgxCategoryChartModule, IgxDataChartVerticalCategoryModule, IgxDataChartComponent, IgxBarSeriesComponent, IgxZoomSliderDynamicModule } from "igniteui-angular-charts"
import { iVentaNetaTipo } from 'src/app/SHARED/interface/i-Venta-Neta-Tipo';

@Component({
  selector: 'app-sidebar-charts',
  standalone: true,
  imports: [CommonModule, IgxComboModule, ReactiveFormsModule, IgxIconModule, IgxLegendModule,
    IgxDataChartCoreModule,
    IgxDataChartCategoryModule,
    IgxDataChartCategoryCoreModule,
    IgxLegendModule,
    IgxCalloutLayerModule,
    IgxDataChartInteractivityModule,
    IgxDataChartAnnotationModule,
    IgxNumberAbbreviatorModule,
    IgxCategoryChartModule,
    IgxDataChartVerticalCategoryModule,
    IgxZoomSliderDynamicModule,
  ],
  templateUrl: './sidebar-charts.component.html',
  styleUrl: './sidebar-charts.component.scss',
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarChatsComponent {

  private datos_1: number[] = [];
  private datos_2: number[] = [];
  public Titulo: string[] = ["", ""];
  private Meses: string[] = [];
  private lstDatos: any[] = [];
  public TotalAnio: number[] = [0, 0];
  public Sucursal: string = "";
  public MaxValue: number = 0;


  public lstDatosFamilia: iVentaNetaTipo[] = [];
  public MaxValueFamilia: number = 0;

  
  public lstDatosSubFamilia: iVentaNetaTipo[] = [];
  public MaxValueSubFamilia: number = 0;

  public lstDatosLinea: iVentaNetaTipo[] = [];
  public MaxValueLinea: number = 0;

  //private myChart: Chart;



  public val = new Validacion();

  lstBodega: iBodega[] = [];



  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;


  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;

  @ViewChild("Charts_Venta_Neta", { static: false })
  public myChart: IgxDataChartComponent;

  @ViewChild("seriesTooltip", { static: false })
  public seriesTooltip: TemplateRef<any>;
  

  
  @ViewChild("Mes1Series", { static: false })
  public Mes1Series: IgxBarSeriesComponent;
  
  @ViewChild("Mes2Series", { static: false })
  public Mes2Series: IgxBarSeriesComponent;

  /*
  @ViewChild('Charts_Venta_Neta', { static: false })
  private ctx: Chart;
*/


  landscape = window.matchMedia("(orientation: landscape)");




  public data: any[];
   EsMobile: boolean = navigator.userAgent.includes("Android") && !this.landscape.matches;

  
  constructor(private GET: getServidor, private cFunciones: Funciones) {


    this.val.add("cmbBodega", "1", "LEN>=", "0", "", "");


    this.val.Get("cmbBodega").setValue([]);





  }


  public formatNumber(num: number): string {
    var ret = num;
    if (num >= 1000000) return (num / 1000000.0).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000.0).toFixed(1) + "K";

    return ret.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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



    let Bodegas: String = "";

    if (this.val.Get("cmbBodega").value.length > 0) {
        Bodegas = ">";
        this.val.Get("cmbBodega").value.Param[2].forEach((e: any) => {
            Bodegas +=   e + "@";
        });
        
    }






    this.GET.GetCharts(Bodegas).subscribe(
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
            this.lstDatosFamilia = Datos[4].d;
            this.lstDatosSubFamilia = Datos[5].d;
            this.lstDatosLinea = Datos[6].d;

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



  
  private Refrescar_Chart(): void {


    let myClonedObject: any[];

    let Bodegas: string[] = this.val.Get("cmbBodega").value;
    this.Sucursal = "";

    var Datos = JSON.parse(JSON.stringify(this.lstDatos));

    if (this.val.Get("cmbBodega").value.length == 0) {

      myClonedObject = Object.assign([], Datos);
    }
    else {
      if (this.val.Get("cmbBodega").value.length == 1) this.Sucursal = this.lstBodega.find(f => f.Codigo == this.val.GetValue("cmbBodega"))?.Key!;


      myClonedObject = Object.assign([], Datos.filter((f: any) => Bodegas.includes(f.Codigo)));
    }

    this.TotalAnio = [0, 0];


    var d1: any[] = myClonedObject.filter(w => w.Anio == Number(this.Titulo[0])).reduce((acc, item) => {

      let accItem: any = acc.find((ai: any) => ai.Anio == item.Anio && ai.Mes == item.Mes)



      if (accItem) {
        accItem.VentaNeta += item.VentaNeta
      } else {
        acc.push(item)
      }

      this.TotalAnio[0] += item.VentaNeta;
      return acc;
    }, []);



    var d2: any[] = myClonedObject.filter(w => w.Anio == Number(this.Titulo[1])).reduce((acc, item) => {

      let accItem: any = acc.find((ai: any) => ai.Anio == item.Anio && ai.Mes == item.Mes)



      if (accItem) {
        accItem.VentaNeta += item.VentaNeta

      } else {
        acc.push(item)
      }
      this.TotalAnio[1] += item.VentaNeta;
      return acc;
    }, []);



    d1 = d1.sort((a, b) => { return a.Mes - b.Mes; });
    d2 = d2.sort((a, b) => { return a.Mes - b.Mes; });



    this.datos_1.splice(0, this.datos_1.length);
    d1.forEach(f => {
      this.datos_1.push(f.VentaNeta);
    });

    this.datos_2.splice(0, this.datos_2.length);
    d2.forEach(f => {
      this.datos_2.push(f.VentaNeta);
    });





    this.data = [];
    for (let i = 0; i <= this.Meses.length - 1; i++) {

      this.data.push({ Mes: this.Meses[i], Mes1: this.datos_1[i], Mes2: this.datos_2[i] });
    }


    let max1  = Math.max(...this.datos_1.map(o => o));
    let max2  = Math.max(...this.datos_2.map(o => o));

    this.MaxValue = max1;
    if(this.MaxValue < max2) this.MaxValue = max2;
    this.MaxValue = this.MaxValue * 1.2;


    for (let i = 0; i < this.data.length ; i++) {
      const item = this.data[i];

      // calculating x-offset for callouts
      item.Mes1X = i;
      item.Mes2X = i + (this.EsMobile ? 0.4 : 0) ;


      // formatting values for callouts
      item.FormattedMes1 = this.formatNumber(item.Mes1);
      item.FormattedMes2 = this.formatNumber(item.Mes2);

      item.FormattedMes1A = this.cFunciones.NumFormat(item.Mes1, "2");
      item.FormattedMes2A = this.cFunciones.NumFormat(item.Mes2, "2");
    }



    this.Mes1Series.showDefaultTooltip = true;
    this.Mes2Series.showDefaultTooltip = true;
    this.Mes1Series.tooltipTemplate = this.seriesTooltip;
    this.Mes2Series.tooltipTemplate = this.seriesTooltip;






    //DATOS FAMILIA

    this.lstDatosFamilia = this.lstDatosFamilia.sort((a, b) => { return  (b.Valor1 + b.Valor2) - (a.Valor1 + a.Valor2); });


    for (let i = 0; i < this.lstDatosFamilia .length ; i++) {
      const item = this.lstDatosFamilia[i];

      if(i == 0)
      {
        this.MaxValueFamilia = item.Valor1;
        if(this.MaxValueFamilia < item.Valor2) this.MaxValueFamilia = item.Valor2;
        this.MaxValueFamilia = this.MaxValueFamilia * 1.2;
      }

      

      // calculating x-offset for callouts
      item.Valor1X = i;
      item.Valor2X = i + 0.4 ;


      // formatting values for callouts
      item.FormattedValor1 = this.formatNumber(item.Valor1);
      item.FormattedValor2 = this.formatNumber(item.Valor2);
    }



    //DATOS SUB FAMILIA

    this.lstDatosSubFamilia = this.lstDatosSubFamilia.sort((a, b) => { return  (b.Valor1 + b.Valor2) - (a.Valor1 + a.Valor2); });


    for (let i = 0; i < this.lstDatosSubFamilia .length ; i++) {
      const item = this.lstDatosSubFamilia[i];

      if(i == 0)
      {
        this.MaxValueSubFamilia = item.Valor1;
        if(this.MaxValueSubFamilia < item.Valor2) this.MaxValueSubFamilia = item.Valor2;
        this.MaxValueSubFamilia = this.MaxValueSubFamilia * 1.2;
      }

      

      // calculating x-offset for callouts
      item.Valor1X = i ;
      item.Valor2X = i - 0.99;


      // formatting values for callouts
      item.FormattedValor1 = this.formatNumber(item.Valor1);
      item.FormattedValor2 = this.formatNumber(item.Valor2);
    }



        //DATOS LINEA

        this.lstDatosLinea = this.lstDatosLinea.sort((a, b) => { return  (b.Valor1 + b.Valor2) - (a.Valor1 + a.Valor2); });


        for (let i = 0; i < this.lstDatosLinea .length ; i++) {
          const item = this.lstDatosLinea[i];
    
          if(i == 0)
          {
            this.MaxValueLinea = item.Valor1;
            if(this.MaxValueLinea < item.Valor2) this.MaxValueLinea = item.Valor2;
            this.MaxValueLinea = this.MaxValueLinea * 1.2;
          }
    
          
    
          // calculating x-offset for callouts
          item.Valor1X = i;
          item.Valor2X = i + 0.3;
    
    
          // formatting values for callouts
          item.FormattedValor1 = this.formatNumber(item.Valor1);
          item.FormattedValor2 = this.formatNumber(item.Valor2);
        }
    


  }




  ngOnInit() {

    this.V_CargarCharts();

    this.landscape.addEventListener("change", (ev: any) => {

      if(navigator.userAgent.includes("Android")  ) 
      {
        if(this.landscape.matches)
        {
          this.EsMobile = false;
        }
        else
        {
          this.EsMobile = true;
        }
        
      }
      else
      {
        this.EsMobile = false;
      }
      

      this.Refrescar_Chart();
   

    });


   

  }

/*



  ngOnInit() {

    this.V_CargarCharts();

    this.landscape.addEventListener("change", (ev: any) => {

      this.Crear_Chart();
     
    });


   

  }


  private Refrescar_Chart(): void {


    let myClonedObject: any[];

    let Bodegas: string[] = this.val.Get("cmbBodega").value;
    this.Sucursal = "";

    var Datos = JSON.parse(JSON.stringify(this.lstDatos));

    if (this.val.Get("cmbBodega").value.length == 0) {

      myClonedObject = Object.assign([], Datos);
    }
    else {
      if (this.val.Get("cmbBodega").value.length == 1) this.Sucursal = this.lstBodega.find(f => f.Codigo == this.val.GetValue("cmbBodega"))?.Key!;


      myClonedObject = Object.assign([], Datos.filter((f: any) => Bodegas.includes(f.Codigo)));
    }

    this.TotalAnio = [0, 0];

    myClonedObject.forEach((f: any) => {
      f.Codigo = "";
      f.Bodega = "";
      f.Contado = 0;
      f.Credito = 0;
      f.VentaBruta = 0;
      f.Devolucion = 0;
      f.Descuento = 0;
      f.Bodificado = 0;
    });



    var d1: any[] = myClonedObject.filter(w => w.Anio == Number(this.Titulo[0])).reduce((acc, item) => {

      let accItem: any = acc.find((ai: any) => ai.Anio == item.Anio && ai.Mes == item.Mes)



      if (accItem) {
        accItem.VentaNeta += item.VentaNeta
      } else {
        acc.push(item)
      }

      this.TotalAnio[0] += item.VentaNeta;
      return acc;
    }, []);



    var d2: any[] = myClonedObject.filter(w => w.Anio == Number(this.Titulo[1])).reduce((acc, item) => {

      let accItem: any = acc.find((ai: any) => ai.Anio == item.Anio && ai.Mes == item.Mes)



      if (accItem) {
        accItem.VentaNeta += item.VentaNeta

      } else {
        acc.push(item)
      }
      this.TotalAnio[1] += item.VentaNeta;
      return acc;
    }, []);



    d1 = d1.sort((a, b) => { return a.Mes - b.Mes; });
    d2 = d2.sort((a, b) => { return a.Mes - b.Mes; });



    this.datos_1.splice(0, this.datos_1.length);
    d1.forEach(f => {
      this.datos_1.push(f.VentaNeta);
    });

    this.datos_2.splice(0, this.datos_2.length);
    d2.forEach(f => {
      this.datos_2.push(f.VentaNeta);
    });



    this.Crear_Chart();




  }




  private Crear_Chart() {


    this.myChart?.destroy();

    this.myChart = new Chart("Charts_Venta_Neta", {
      data: {
        datasets: [{
          type: 'bar',
          label: this.Titulo[0],
          data: this.datos_1,
          backgroundColor: [
            'rgba(255, 69, 0, 0.4)',


          ], borderColor: [
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
          borderWidth: 1,
        }],
        labels: this.Meses,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: window.screen.orientation.angle == 90 || navigator.userAgent.includes("Android") ? "y" : "x",
        animation: {
          duration: 1000,
          onComplete: function () {


          }
        },

        scales: {
          x: {
            display: true,
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              align: 'center',
              text: this.Sucursal,
              color: 'blue',
              font: {
                weight: 'bold',
                size: 15
              }
            },

            /* ticks: {
 
               callback: function (value: any, index, ticks) {
 
 
                 if(!navigator.userAgent.includes("Android"))
                 {
                   var v: any = (Math.abs(value) / 1000).toFixed(1);
 
 
                   return value.toLocaleString('en-US', {
                     // add suffixes for thousands, millions, and billions
                     // the maximum number of decimal places to use
                     maximumFractionDigits: 2,
                     // specify the abbreviations to use for the suffixes
                     notation: 'compact',
                     compactDisplay: 'short'
                   });
   
                 }
                 else
                 {
                   return value;
                 }
                 
               }
             }
 */
/*
          }
        },
        plugins: {
          datalabels: {
            color: 'black',
            anchor: 'end',
            align: 'end',
            rotation: window.screen.orientation.angle == 0 && !navigator.userAgent.includes("Android") ? -45 : 0,
            font: {
              weight: 'bold',
              size: 12,
            },

            formatter: function (value: any, context: any) {

              var v: any = (Math.abs(value) / 1000).toFixed(1);

              //  return Math.abs(value) > 999 ? Math.sign(value)* v + 'k' : Math.sign(value)*Math.abs(value)


              return value.toLocaleString('en-US', {
                // add suffixes for thousands, millions, and billions
                // the maximum number of decimal places to use
                maximumFractionDigits: 2,
                // specify the abbreviations to use for the suffixes
                notation: 'compact',
                compactDisplay: 'short'
              });



            }
          },

          legend: {
            labels: {
              font: {
                size: 15
              }
            }
          },

          title: {
            display: true,
            align: 'center',
            text: 'VENTAS ' + this.Titulo[0] + ' - ' + this.Titulo[0],
          },
          subtitle: {
            display: true,
            align: "center",
            text: this.cFunciones.NumFormat(this.TotalAnio[1], "2"),
            color: "blue",
            font: {
              weight: 'bold',
              size: 15,
            }
          }

        }
      }
      ,
      plugins: [ChartDataLabels],

    });

    this.myChart.canvas.style.height = "600px";
  }

*/
}

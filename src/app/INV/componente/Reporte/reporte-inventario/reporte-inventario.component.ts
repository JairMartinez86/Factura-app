import { Component } from '@angular/core';
import { ReporteInventarioFiltro1Component } from "./Filtros/reporte-inventario-filtro-1/reporte-inventario-filtro-1.component";
import { CommonModule } from '@angular/common';
import { ReporteInventarioFiltro2Component } from "./Filtros/reporte-inventario-filtro-2/reporte-inventario-filtro-2.component";
import { ReporteInventarioFiltro3Component } from "./Filtros/reporte-inventario-filtro-3/reporte-inventario-filtro-3.component";
import { ReporteInventarioFiltro4Component } from "./Filtros/reporte-inventario-filtro-4/reporte-inventario-filtro-4.component";

@Component({
    selector: 'app-reporte-inventario',
    standalone: true,
    templateUrl: './reporte-inventario.component.html',
    styleUrl: './reporte-inventario.component.scss',
    imports: [ReporteInventarioFiltro1Component, CommonModule, ReporteInventarioFiltro2Component, ReporteInventarioFiltro3Component, ReporteInventarioFiltro4Component]
})
export class ReporteInventarioComponent {

    public FIltro_1 : boolean = false;
    public FIltro_2 : boolean = false;
    public FIltro_3 : boolean = false;
    public FIltro_4 : boolean = false;
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVentaFiltro2Component } from './reporte-venta-filtro-2.component';

describe('ReporteVentaFiltro2Component', () => {
  let component: ReporteVentaFiltro2Component;
  let fixture: ComponentFixture<ReporteVentaFiltro2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteVentaFiltro2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteVentaFiltro2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

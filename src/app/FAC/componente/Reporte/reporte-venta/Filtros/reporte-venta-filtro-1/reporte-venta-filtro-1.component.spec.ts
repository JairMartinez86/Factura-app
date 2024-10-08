import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVentaFiltro1Component } from './reporte-venta-filtro-1.component';

describe('ReporteVentaFiltro1Component', () => {
  let component: ReporteVentaFiltro1Component;
  let fixture: ComponentFixture<ReporteVentaFiltro1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteVentaFiltro1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteVentaFiltro1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

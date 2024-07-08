import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioFiltro8Component } from './reporte-inventario-filtro-8.component';

describe('ReporteInventarioFiltro8Component', () => {
  let component: ReporteInventarioFiltro8Component;
  let fixture: ComponentFixture<ReporteInventarioFiltro8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioFiltro8Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioFiltro8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

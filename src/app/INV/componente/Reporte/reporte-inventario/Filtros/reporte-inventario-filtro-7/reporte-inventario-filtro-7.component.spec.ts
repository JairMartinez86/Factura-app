import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioFiltro7Component } from './reporte-inventario-filtro-7.component';

describe('ReporteInventarioFiltro7Component', () => {
  let component: ReporteInventarioFiltro7Component;
  let fixture: ComponentFixture<ReporteInventarioFiltro7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioFiltro7Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioFiltro7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

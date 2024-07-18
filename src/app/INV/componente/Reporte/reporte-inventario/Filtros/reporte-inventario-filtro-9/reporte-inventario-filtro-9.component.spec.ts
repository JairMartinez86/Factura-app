import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioFiltro9Component } from './reporte-inventario-filtro-9.component';

describe('ReporteInventarioFiltro9Component', () => {
  let component: ReporteInventarioFiltro9Component;
  let fixture: ComponentFixture<ReporteInventarioFiltro9Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioFiltro9Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioFiltro9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

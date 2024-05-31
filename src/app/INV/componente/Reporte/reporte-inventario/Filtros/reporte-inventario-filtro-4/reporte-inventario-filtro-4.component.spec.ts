import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioFiltro4Component } from './reporte-inventario-filtro-4.component';

describe('ReporteInventarioFiltro4Component', () => {
  let component: ReporteInventarioFiltro4Component;
  let fixture: ComponentFixture<ReporteInventarioFiltro4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioFiltro4Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteInventarioFiltro4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioFiltro6Component } from './reporte-inventario-filtro-6.component';

describe('ReporteInventarioFiltro6Component', () => {
  let component: ReporteInventarioFiltro6Component;
  let fixture: ComponentFixture<ReporteInventarioFiltro6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioFiltro6Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteInventarioFiltro6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

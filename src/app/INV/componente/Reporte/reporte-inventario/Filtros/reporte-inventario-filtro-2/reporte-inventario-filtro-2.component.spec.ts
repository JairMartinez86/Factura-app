import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioFiltro2Component } from './reporte-inventario-filtro-2.component';

describe('ReporteInventarioFiltro2Component', () => {
  let component: ReporteInventarioFiltro2Component;
  let fixture: ComponentFixture<ReporteInventarioFiltro2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioFiltro2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteInventarioFiltro2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioFiltro3Component } from './reporte-inventario-filtro-3.component';

describe('ReporteInventarioFiltro3Component', () => {
  let component: ReporteInventarioFiltro3Component;
  let fixture: ComponentFixture<ReporteInventarioFiltro3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioFiltro3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteInventarioFiltro3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

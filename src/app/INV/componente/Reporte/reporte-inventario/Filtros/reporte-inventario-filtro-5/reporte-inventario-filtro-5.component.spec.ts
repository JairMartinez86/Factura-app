import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioFiltro5Component } from './reporte-inventario-filtro-5.component';

describe('ReporteInventarioFiltro5Component', () => {
  let component: ReporteInventarioFiltro5Component;
  let fixture: ComponentFixture<ReporteInventarioFiltro5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioFiltro5Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteInventarioFiltro5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

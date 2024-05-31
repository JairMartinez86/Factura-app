import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioFiltro1Component } from './reporte-inventario-filtro-1.component';

describe('TransaccionInventarioComponent', () => {
  let component: ReporteInventarioFiltro1Component;
  let fixture: ComponentFixture<ReporteInventarioFiltro1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioFiltro1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteInventarioFiltro1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

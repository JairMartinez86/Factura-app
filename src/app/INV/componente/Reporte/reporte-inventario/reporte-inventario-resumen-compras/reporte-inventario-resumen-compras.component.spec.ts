import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioResumenComprasComponent } from './reporte-inventario-resumen-compras.component';

describe('ReporteInventarioResumenComprasComponent', () => {
  let component: ReporteInventarioResumenComprasComponent;
  let fixture: ComponentFixture<ReporteInventarioResumenComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioResumenComprasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioResumenComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

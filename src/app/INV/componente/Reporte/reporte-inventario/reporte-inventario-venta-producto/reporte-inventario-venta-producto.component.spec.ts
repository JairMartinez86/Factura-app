import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioVentaProductoComponent } from './reporte-inventario-venta-producto.component';

describe('ReporteInventarioVentaProductoComponent', () => {
  let component: ReporteInventarioVentaProductoComponent;
  let fixture: ComponentFixture<ReporteInventarioVentaProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioVentaProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioVentaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

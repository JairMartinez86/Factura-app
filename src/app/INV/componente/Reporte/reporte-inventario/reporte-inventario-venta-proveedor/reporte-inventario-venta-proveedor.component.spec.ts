import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioVentaProveedorComponent } from './reporte-inventario-venta-proveedor.component';

describe('ReporteInventarioVentaProveedorComponent', () => {
  let component: ReporteInventarioVentaProveedorComponent;
  let fixture: ComponentFixture<ReporteInventarioVentaProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioVentaProveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioVentaProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

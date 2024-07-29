import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioFacturaProveedorComponent } from './reporte-inventario-factura-proveedor.component';

describe('ReporteInventarioFacturaProveedorComponent', () => {
  let component: ReporteInventarioFacturaProveedorComponent;
  let fixture: ComponentFixture<ReporteInventarioFacturaProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioFacturaProveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioFacturaProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

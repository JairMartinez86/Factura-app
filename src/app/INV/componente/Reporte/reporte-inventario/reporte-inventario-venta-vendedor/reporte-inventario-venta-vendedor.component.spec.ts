import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioVentaVendedorComponent } from './reporte-inventario-venta-vendedor.component';

describe('ReporteInventarioVentaVendedorComponent', () => {
  let component: ReporteInventarioVentaVendedorComponent;
  let fixture: ComponentFixture<ReporteInventarioVentaVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioVentaVendedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioVentaVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

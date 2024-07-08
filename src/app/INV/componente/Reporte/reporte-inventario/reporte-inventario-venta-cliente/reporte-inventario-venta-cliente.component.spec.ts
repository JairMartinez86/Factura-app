import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioVentaClienteComponent } from './reporte-inventario-venta-cliente.component';

describe('ReporteInventarioVentaClienteComponent', () => {
  let component: ReporteInventarioVentaClienteComponent;
  let fixture: ComponentFixture<ReporteInventarioVentaClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioVentaClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioVentaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

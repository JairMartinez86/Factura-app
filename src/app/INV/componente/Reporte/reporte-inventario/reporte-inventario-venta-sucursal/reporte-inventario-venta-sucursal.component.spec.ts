import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioVentaSucursalComponent } from './reporte-inventario-venta-sucursal.component';

describe('ReporteInventarioVentaSucursalComponent', () => {
  let component: ReporteInventarioVentaSucursalComponent;
  let fixture: ComponentFixture<ReporteInventarioVentaSucursalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioVentaSucursalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioVentaSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

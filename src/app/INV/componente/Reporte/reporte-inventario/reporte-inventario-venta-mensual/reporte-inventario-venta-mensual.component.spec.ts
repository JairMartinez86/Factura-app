import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioVentaMensualComponent } from './reporte-inventario-venta-mensual.component';

describe('ReporteInventarioVentaMensualComponent', () => {
  let component: ReporteInventarioVentaMensualComponent;
  let fixture: ComponentFixture<ReporteInventarioVentaMensualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioVentaMensualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioVentaMensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

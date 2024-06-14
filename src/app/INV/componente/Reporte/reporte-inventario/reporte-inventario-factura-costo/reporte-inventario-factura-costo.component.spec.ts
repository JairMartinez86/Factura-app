import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioFacturaCostoComponent } from './reporte-inventario-factura-costo.component';

describe('ReporteInventarioFacturaCostoComponent', () => {
  let component: ReporteInventarioFacturaCostoComponent;
  let fixture: ComponentFixture<ReporteInventarioFacturaCostoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioFacturaCostoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInventarioFacturaCostoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

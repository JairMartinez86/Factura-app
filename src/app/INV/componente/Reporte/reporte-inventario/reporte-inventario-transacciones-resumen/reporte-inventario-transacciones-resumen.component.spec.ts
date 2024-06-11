import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInventarioTransaccionesResumenComponent } from './reporte-inventario-transacciones-resumen.component';

describe('ReporteInventarioTransaccionesResumenComponent', () => {
  let component: ReporteInventarioTransaccionesResumenComponent;
  let fixture: ComponentFixture<ReporteInventarioTransaccionesResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInventarioTransaccionesResumenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteInventarioTransaccionesResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
